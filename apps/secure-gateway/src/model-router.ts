import { IBPComplianceTracker } from './compliance-trackers';

export interface ModelRoutingRequest {
  taskDescription: string;
  toolName?: string;
  subagentId?: string;
  estimatedTokens?: number;
}

export interface ModelRoutingResponse {
  recommendedModel: string;
  reason: string;
  maxTokens?: number;
}

export function routeModel(
  request: ModelRoutingRequest,
  ibpTracker: IBPComplianceTracker
): ModelRoutingResponse {
  const { taskDescription, toolName, subagentId } = request;

  // 1. Check subagent-specific budget if subagentId is provided
  if (subagentId) {
    const ibpState = ibpTracker.getState();
    const sub = ibpState.subagentBudgets?.[subagentId];
    if (sub) {
      const remaining = sub.tokenBudget - sub.tokensConsumed;
      if (remaining < 5000) {
        return {
          recommendedModel: 'gemini-3.5-flash',
          reason: `Downgraded to Flash due to low remaining subagent budget (${remaining} tokens left).`
        };
      }
    }
  }

  // 2. Check global remaining budget
  const ibpState = ibpTracker.getState();
  const globalRemaining = ibpState.tokenBudget - ibpState.tokensConsumed;
  if (globalRemaining < 15000) {
    return {
      recommendedModel: 'gemini-3.5-flash',
      reason: `Downgraded to Flash due to low remaining global budget (${globalRemaining} tokens left).`
    };
  }

  // 3. Determine complexity of the task
  const lowerDesc = taskDescription.toLowerCase();
  const lowerTool = toolName ? toolName.toLowerCase() : '';

  const isHighComplexity = 
    lowerTool === 'execute_command' ||
    lowerTool === 'write_file' ||
    lowerTool === 'replace_file_content' ||
    lowerTool === 'multi_replace_file_content' ||
    lowerDesc.includes('compile') ||
    lowerDesc.includes('build') ||
    lowerDesc.includes('refactor') ||
    lowerDesc.includes('audit') ||
    lowerDesc.includes('security') ||
    lowerDesc.includes('implement') ||
    lowerDesc.includes('fix') ||
    lowerDesc.includes('test') ||
    lowerDesc.includes('optimize');

  if (isHighComplexity) {
    return {
      recommendedModel: 'gemini-3.5-pro',
      reason: 'Recommended Pro for high-complexity operations (compilation/writing/auditing).'
    };
  }

  // 4. Default to flash for low-complexity read-only tasks
  return {
    recommendedModel: 'gemini-3.5-flash',
    reason: 'Recommended Flash for low-complexity read/exploratory operations.'
  };
}
