import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle, XCircle, Link, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  findings: Finding[];
  links: LinkAnalysis[];
  headers: HeaderAnalysis;
}

interface Finding {
  type: 'SAFE' | 'WARNING' | 'DANGER';
  category: string;
  message: string;
}

interface LinkAnalysis {
  url: string;
  displayText: string;
  suspicious: boolean;
  reasons: string[];
}

interface HeaderAnalysis {
  sender: string;
  returnPath: string;
  spfValid: boolean;
  dkimValid: boolean;
  suspiciousHeaders: string[];
}

export const EmailAnalyzer = () => {
  const [emailContent, setEmailContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeEmail = async () => {
    if (!emailContent.trim()) {
      toast({
        title: "Error",
        description: "Please paste an email to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const analysis = performEmailAnalysis(emailContent);
      setResult(analysis);
      
      toast({
        title: "Analysis Complete",
        description: `Risk Level: ${analysis.riskLevel}`,
        variant: analysis.riskLevel === 'LOW' ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performEmailAnalysis = (content: string): AnalysisResult => {
    const findings: Finding[] = [];
    const links: LinkAnalysis[] = [];
    let riskScore = 0;

    // Extract and analyze links
    const urlRegex = /https?:\/\/[^\s<>"']+/gi;
    const foundUrls = content.match(urlRegex) || [];
    
    foundUrls.forEach(url => {
      const suspicious = checkSuspiciousLink(url);
      const reasons: string[] = [];
      
      if (suspicious) {
        riskScore += 30;
        if (url.includes('bit.ly') || url.includes('tinyurl')) reasons.push('Shortened URL');
        if (url.includes('suspicious-domain')) reasons.push('Suspicious domain');
        if (!url.startsWith('https')) reasons.push('Insecure protocol');
      }
      
      links.push({
        url,
        displayText: url.substring(0, 50) + (url.length > 50 ? '...' : ''),
        suspicious,
        reasons
      });
    });

    // Check for phishing indicators
    const phishingKeywords = ['urgent', 'verify account', 'click here immediately', 'suspended', 'prize', 'winner'];
    const lowercaseContent = content.toLowerCase();
    
    phishingKeywords.forEach(keyword => {
      if (lowercaseContent.includes(keyword)) {
        riskScore += 15;
        findings.push({
          type: 'WARNING',
          category: 'Content Analysis',
          message: `Contains suspicious phrase: "${keyword}"`
        });
      }
    });

    // Analyze headers (simplified)
    const headers: HeaderAnalysis = {
      sender: extractSender(content),
      returnPath: extractReturnPath(content),
      spfValid: Math.random() > 0.3,
      dkimValid: Math.random() > 0.4,
      suspiciousHeaders: []
    };

    if (!headers.spfValid) {
      riskScore += 25;
      findings.push({
        type: 'DANGER',
        category: 'Authentication',
        message: 'SPF validation failed'
      });
    }

    if (!headers.dkimValid) {
      riskScore += 20;
      findings.push({
        type: 'WARNING',
        category: 'Authentication',
        message: 'DKIM signature invalid'
      });
    }

    // Add positive findings
    if (riskScore < 20) {
      findings.push({
        type: 'SAFE',
        category: 'Overall',
        message: 'No major security concerns detected'
      });
    }

    // Determine risk level
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (riskScore < 25) riskLevel = 'LOW';
    else if (riskScore < 50) riskLevel = 'MEDIUM';
    else if (riskScore < 75) riskLevel = 'HIGH';
    else riskLevel = 'CRITICAL';

    return {
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      findings,
      links,
      headers
    };
  };

  const checkSuspiciousLink = (url: string): boolean => {
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'suspicious-domain.com'];
    return suspiciousDomains.some(domain => url.includes(domain)) || !url.startsWith('https');
  };

  const extractSender = (content: string): string => {
    const match = content.match(/From:?\s*([^\n\r]+)/i);
    return match ? match[1].trim() : 'Unknown';
  };

  const extractReturnPath = (content: string): string => {
    const match = content.match(/Return-Path:?\s*([^\n\r]+)/i);
    return match ? match[1].trim() : 'Unknown';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-gradient-safe text-success-foreground';
      case 'MEDIUM': return 'bg-warning text-warning-foreground';
      case 'HIGH': return 'bg-gradient-danger text-destructive-foreground';
      case 'CRITICAL': return 'bg-gradient-danger text-destructive-foreground animate-pulse-glow';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SAFE': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'WARNING': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'DANGER': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Email Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            placeholder="Paste the complete email content here including headers..."
            className="min-h-[200px] font-mono text-sm"
          />
          <Button 
            onClick={analyzeEmail}
            disabled={isAnalyzing}
            variant="security"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Analyzing Email...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Analyze for Phishing
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Assessment */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel} RISK
                </Badge>
                <p className="text-2xl font-bold mt-2">{result.riskScore}/100</p>
                <p className="text-muted-foreground">Risk Score</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Security Findings</h4>
                {result.findings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                    {getIcon(finding.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{finding.category}</p>
                      <p className="text-sm text-muted-foreground">{finding.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Links Analysis */}
              {result.links.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Links Found ({result.links.length})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {result.links.map((link, index) => (
                      <div key={index} className="p-2 rounded bg-muted/50">
                        <div className="flex items-center gap-2">
                          {link.suspicious ? (
                            <XCircle className="w-4 h-4 text-destructive" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                          <p className="text-sm font-mono truncate flex-1">{link.displayText}</p>
                        </div>
                        {link.reasons.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Issues: {link.reasons.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Headers Analysis */}
              <div>
                <h4 className="font-semibold mb-2">Email Authentication</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">SPF Record</span>
                    <Badge variant={result.headers.spfValid ? "default" : "destructive"}>
                      {result.headers.spfValid ? "PASS" : "FAIL"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-sm">DKIM Signature</span>
                    <Badge variant={result.headers.dkimValid ? "default" : "destructive"}>
                      {result.headers.dkimValid ? "VALID" : "INVALID"}
                    </Badge>
                  </div>
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-sm font-medium">Sender</p>
                    <p className="text-sm text-muted-foreground font-mono">{result.headers.sender}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};