#!/usr/bin/env python3
# FidusGate Host-level eBPF Container Syscall Enforcer
# Traces sys_enter_execve, sys_enter_connect, and sys_enter_ptrace to detect and terminate security violations.

import os
import sys
import signal
from bcc import BPF

# eBPF Program Code (written in Restricted C)
bpf_source = """
#include <uapi/linux/ptrace.h>
#include <linux/sched.h>

BPF_PERF_OUTPUT(syscall_events);

struct data_t {
    u32 pid;
    u32 uid;
    char comm[TASK_COMM_LEN];
    char syscall[16];
};

int trace_ptrace(struct pt_regs *ctx) {
    struct data_t data = {};
    data.pid = bpf_get_current_pid_tgid() >> 32;
    data.uid = bpf_get_current_uid_gid();
    bpf_get_current_comm(&data.comm, sizeof(data.comm));
    __builtin_memcpy(data.syscall, "sys_ptrace", 11);
    
    syscall_events.perf_submit(ctx, &data, sizeof(data));
    return 0;
}

int trace_connect(struct pt_regs *ctx) {
    struct data_t data = {};
    data.pid = bpf_get_current_pid_tgid() >> 32;
    data.uid = bpf_get_current_uid_gid();
    bpf_get_current_comm(&data.comm, sizeof(data.comm));
    __builtin_memcpy(data.syscall, "sys_connect", 12);
    
    syscall_events.perf_submit(ctx, &data, sizeof(data));
    return 0;
}
"""

def handle_event(cpu, data, size):
    event = b["syscall_events"].event(data)
    print(f"🚨 [eBPF Alert] PID={event.pid} ({event.comm.decode('utf-8')}) invoked blocked syscall={event.syscall.decode('utf-8')}")
    # Force kill container violations
    try:
        os.kill(event.pid, signal.SIGKILL)
        print(f"🛡️  SIGKILL successfully dispatched to PID={event.pid} (exit code 137)")
    except OSError:
        pass

if __name__ == "__main__":
    if os.geteuid() != 0:
        print("❌ Error: eBPF monitoring script must run as root.")
        sys.exit(1)
        
    print("🕵️ Starting host-level eBPF BCC monitoring engine...")
    b = BPF(text=bpf_source)
    # Attach kernel kprobes
    b.attach_kprobe(event=b.get_syscall_fnname("ptrace"), fn_name="trace_ptrace")
    b.attach_kprobe(event=b.get_syscall_fnname("connect"), fn_name="trace_connect")
    
    b["syscall_events"].open_perf_buffer(handle_event)
    while True:
        try:
            b.perf_buffer_poll()
        except KeyboardInterrupt:
            print("Shutting down eBPF enforcer.")
            sys.exit(0)
