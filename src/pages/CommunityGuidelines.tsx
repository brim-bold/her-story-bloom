import { ArrowLeft, Heart, MessageCircle, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CommunityGuidelines() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* SEO Meta Tags */}
      <title>Community Guidelines - Building a Supportive Network</title>
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community Guidelines</h1>
          <p className="text-muted-foreground">Building a supportive and empowering network together</p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Welcome to Our Community
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            Our community is built on the foundation of empowerment, support, and genuine connection. 
            These guidelines help us maintain a safe, inclusive space where everyone can grow and thrive together.
          </p>
        </CardContent>
      </Card>

      {/* Core Values */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Be Kind & Compassionate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li>• Treat every member with respect and empathy</li>
              <li>• Offer support and encouragement to others</li>
              <li>• Celebrate each other's wins, big and small</li>
              <li>• Be patient with those who are learning</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Create a Non-Judgmental Space
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li>• Everyone's journey is unique and valid</li>
              <li>• Avoid criticism or negative comments</li>
              <li>• Share advice constructively and kindly</li>
              <li>• Respect different perspectives and experiences</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Communication Guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Communication Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 text-foreground">❌ No Cold Requests</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Build genuine relationships before making requests. Take time to:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground ml-4">
              <li>• Introduce yourself and get to know others</li>
              <li>• Engage meaningfully in conversations</li>
              <li>• Offer value and support before asking for help</li>
              <li>• Build trust through consistent, authentic interactions</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 text-foreground">✅ Meaningful Connections</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Share your story and listen to others</li>
              <li>• Ask thoughtful questions and show genuine interest</li>
              <li>• Offer help and resources when you can</li>
              <li>• Be authentic and vulnerable when appropriate</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Community Standards */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Community Standards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 text-foreground">Respect & Inclusion</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• No discrimination of any kind</li>
                <li>• Respect privacy and confidentiality</li>
                <li>• Use inclusive language</li>
                <li>• Honor personal boundaries</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-foreground">Professional Conduct</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Keep conversations appropriate</li>
                <li>• No spam or excessive self-promotion</li>
                <li>• Respect intellectual property</li>
                <li>• Maintain professional boundaries</li>
              </ul>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2 text-foreground">Content Guidelines</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Share relevant, valuable content</li>
              <li>• Give credit where it's due</li>
              <li>• Avoid controversial or divisive topics</li>
              <li>• Keep posts constructive and solution-focused</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Enforcement */}
      <Card>
        <CardHeader>
          <CardTitle>Community Enforcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We're committed to maintaining a positive environment for everyone. Guidelines are enforced through:
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-foreground">1st Violation</h5>
              <p className="text-muted-foreground">Friendly reminder and guidance</p>
            </div>
            <div>
              <h5 className="font-medium text-foreground">2nd Violation</h5>
              <p className="text-muted-foreground">Formal warning and coaching</p>
            </div>
            <div>
              <h5 className="font-medium text-foreground">3rd Violation</h5>
              <p className="text-muted-foreground">Temporary or permanent removal</p>
            </div>
          </div>
          
          <Separator />
          
          <p className="text-sm text-muted-foreground">
            Questions about these guidelines? Reach out to our support team - we're here to help create the best possible community experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}