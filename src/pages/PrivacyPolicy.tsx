import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Calendar, Eye, Lock, Database, UserCheck } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <h1 className="text-2xl font-bold text-foreground font-serif">Privacy Policy</h1>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Her Story Collective Privacy Policy
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Last updated: {lastUpdated}
            </div>
          </CardHeader>
          
          <CardContent className="prose prose-gray max-w-none space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-card-foreground font-medium">
                Your privacy is fundamental to our mission of creating a safe, supportive community for women. This policy explains how we collect, use, protect, and share your information.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Database className="w-5 h-5 text-accent" />
                1. Information We Collect
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-card-foreground">Information You Provide</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                    <li>Profile information (name, age, location, bio, interests)</li>
                    <li>Account credentials (email, password)</li>
                    <li>Messages and communications with other users</li>
                    <li>Event participation and feedback</li>
                    <li>Support requests and correspondence</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-card-foreground">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                    <li>Device information (browser, operating system, IP address)</li>
                    <li>Usage data (pages visited, features used, time spent)</li>
                    <li>Location data (if you enable location services)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                2. How We Use Your Information
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide and improve our services</li>
                  <li>Connect you with other women based on shared interests</li>
                  <li>Facilitate communication and event organization</li>
                  <li>Send you notifications and updates (if you opt in)</li>
                  <li>Ensure platform safety and security</li>
                  <li>Provide customer support</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-coral" />
                3. Information Sharing and Disclosure
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-card-foreground">With Other Users</h3>
                  <p className="text-muted-foreground">
                    Profile information you choose to make public is visible to other users to facilitate connections. You control what information is displayed through your privacy settings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-card-foreground">With Third Parties</h3>
                  <p className="text-muted-foreground">
                    We do not sell your personal information. We may share information with:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-muted-foreground">
                    <li>Service providers who help us operate the platform</li>
                    <li>Legal authorities when required by law</li>
                    <li>In case of business transfer or merger (with notice)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                4. Data Security and Protection
              </h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>We implement comprehensive security measures:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Secure authentication systems</li>
                  <li>Limited access to personal data by authorized personnel</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">5. Your Privacy Rights and Choices</h2>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Update or correct your profile information</li>
                  <li>Control profile visibility and privacy settings</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request deletion of your account and data</li>
                  <li>Download your data (data portability)</li>
                  <li>Object to certain data processing activities</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">6. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage, and provide personalized features. You can control cookie preferences through your browser settings, though some functionality may be limited.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance, fraud prevention, and safety purposes for a limited time.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">8. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware of such collection, we will take steps to delete the information.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes via email or app notification. Your continued use of the service after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-card-foreground">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <p className="text-card-foreground font-medium">Data Protection Officer</p>
                <p className="text-muted-foreground">Email: privacy@herstory.app</p>
                <p className="text-muted-foreground">Subject: Privacy Inquiry</p>
                <p className="text-muted-foreground">Address: [Your Business Address]</p>
              </div>
            </div>

            <div className="border-t border-border pt-6 mt-8">
              <p className="text-sm text-muted-foreground">
                By using Her Story Collective, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and sharing of your information as described herein.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;