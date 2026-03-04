import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Calendar } from 'lucide-react';

const TermsOfService = () => {
  const navigate = useNavigate();
  const lastUpdated = 'December 1, 2024';

  return (
    <div className="min-h-screen bg-gradient-profile">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settings')}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground font-serif">Terms of Service</h1>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Her Story Collective Terms of Service
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last updated: {lastUpdated}
            </div>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Her Story Collective ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Her Story Collective is a platform designed to connect women with shared interests, facilitate meaningful friendships, and build a supportive community. Our service includes profile creation, messaging, event organization, and community features.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">3. User Accounts and Registration</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>To use certain features of the Service, you must register for an account. You agree to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your information to keep it accurate and complete</li>
                  <li>Keep your password secure and not share account access</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">4. Community Guidelines and Acceptable Use</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>You agree to use the Service responsibly and not to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Harass, abuse, or harm other users</li>
                  <li>Post discriminatory, hateful, or offensive content</li>
                  <li>Share false or misleading information</li>
                  <li>Violate others' privacy or intellectual property rights</li>
                  <li>Use the platform for commercial purposes without permission</li>
                  <li>Create fake profiles or impersonate others</li>
                  <li>Spam or send unsolicited communications</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">5. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Service, you consent to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">6. Content and Intellectual Property</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>Regarding content you create and share:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You retain ownership of your content</li>
                  <li>You grant us a license to use, display, and distribute your content on the platform</li>
                  <li>You are responsible for ensuring you have the right to share content</li>
                  <li>We may remove content that violates these terms</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">7. Safety and Security</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>While we strive to create a safe environment:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We cannot guarantee the safety of all interactions</li>
                  <li>You are responsible for your own safety when meeting others</li>
                  <li>Always meet in public places for first meetings</li>
                  <li>Report any inappropriate behavior or safety concerns</li>
                  <li>We reserve the right to investigate and take action on reports</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your account at any time for violations of these terms. You may also delete your account at any time through your settings. Upon termination, your right to use the Service ceases immediately.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">9. Disclaimers and Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided "as is" without warranties. We are not liable for any damages arising from your use of the Service, including but not limited to interactions with other users, technical issues, or data loss.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the Service after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-card-foreground font-medium">Her Story Collective</p>
                <p className="text-muted-foreground">Email: legal@herstory.app</p>
                <p className="text-muted-foreground">Address: [Your Business Address]</p>
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                By using Her Story Collective, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;