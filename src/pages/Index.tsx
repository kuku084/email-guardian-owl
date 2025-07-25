import { Header } from '@/components/Header';
import { EmailAnalyzer } from '@/components/EmailAnalyzer';
import heroImage from '@/assets/guardian-owl-hero.jpg';
import { Shield, Mail, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-6">
              Protect Yourself from Email Threats
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Advanced AI-powered email analysis to detect phishing attempts, suspicious links, 
              and verify sender authenticity in seconds.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <h3 className="font-semibold mb-2">Header Analysis</h3>
                  <p className="text-sm text-white/80">Verify sender authenticity and check SPF/DKIM records</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Eye className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <h3 className="font-semibold mb-2">Link Verification</h3>
                  <p className="text-sm text-white/80">Scan and analyze all links for malicious content</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <h3 className="font-semibold mb-2">Security Report</h3>
                  <p className="text-sm text-white/80">Get detailed risk assessment and safety recommendations</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </section>

      {/* Main Analysis Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <EmailAnalyzer />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold">Email Guardian Owl</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Advanced email security analysis to keep you safe from phishing attacks
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
