import { Clock, Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="container-narrow py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-serif font-medium">Time Capsule</span>
            </a>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Preserve your most precious memories and send them to the future. 
              Because some moments deserve to be remembered.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/#how-it-works" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="/faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Time Capsule. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
