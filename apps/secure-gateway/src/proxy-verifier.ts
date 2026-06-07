import * as http from 'node:http';
import * as url from 'node:url';
import { CedarEvaluator } from './cedar-evaluator';

export function createProxyVerifier(evaluator: CedarEvaluator) {
  return (req: http.IncomingMessage, res: http.ServerResponse, next?: () => void) => {
    const requestUrl = req.url || '';
    try {
      const parsed = url.parse(requestUrl);
      const host = parsed.host || parsed.hostname || '';
      
      if (!host) {
        if (next) next();
        return;
      }

      // Query Cedar policy to see if this domain/host egress is permitted
      const decision = evaluator.isAuthorized(
        'mcp-agent@fidusgate.internal',
        'outbound_connect',
        { host }
      );

      if (decision === 'allow') {
        if (next) next();
      } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: 'Egress Blocked by FidusGate proxy-verifier',
          message: `Outbound connection to domain '${host}' is not allowed under current Cedar rules.`
        }));
      }
    } catch (e: any) {
      res.statusCode = 500;
      res.end('Proxy Verification Error: ' + e.message);
    }
  };
}
