import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useGetSocialLinks } from "../hooks/useQueries";
import { useRouter } from "../router";

const GALLERY_IMAGES = [
  "/assets/generated/gallery-farewell.dim_800x500.jpg",
  "/assets/generated/gallery-science.dim_800x500.jpg",
  "/assets/generated/hero-slide1.dim_1200x600.jpg",
  "/assets/generated/hero-slide2.dim_1200x600.jpg",
  "/assets/generated/hero-slide3.dim_1200x600.jpg",
  "/assets/generated/friend-male1.dim_200x200.jpg",
];

export default function Footer() {
  const { navigate } = useRouter();
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const { data: socialLinks } = useGetSocialLinks();

  return (
    <footer className="footer-gradient text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white/90 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Friends", path: "/friends" },
                { label: "Photos", path: "/photos" },
                { label: "Videos", path: "/videos" },
                { label: "PDFs", path: "/pdfs" },
                { label: "Social", path: "/social" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Gallery thumbnails */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white/90 uppercase tracking-wider">
              Gallery
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {GALLERY_IMAGES.map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => navigate("/photos")}
                  className="aspect-square overflow-hidden rounded-md opacity-80 hover:opacity-100 transition-opacity"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white/90 uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex gap-3 mb-4">
              {[
                {
                  icon: Facebook,
                  href: socialLinks?.facebook || "https://facebook.com",
                  label: "Facebook",
                },
                {
                  icon: Instagram,
                  href: socialLinks?.instagram || "https://instagram.com",
                  label: "Instagram",
                },
                {
                  icon: Youtube,
                  href: socialLinks?.youtube || "https://youtube.com",
                  label: "YouTube",
                },
                {
                  icon: Twitter,
                  href: "https://twitter.com",
                  label: "Twitter",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="text-white/70 text-sm">
              Harishchar Union High School and College
              <br />
              SSC Batch 2023
              <br />
              Harishchar, Bangladesh
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/60">
          <p>
            &copy; {year} Harishchar Union High School and College. All rights
            reserved.
          </p>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p>
              Developed by:{" "}
              <a
                href="https://www.facebook.com/khandakerjabirhossain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white underline underline-offset-2"
              >
                Khandaker Jabir Hossain
              </a>
            </p>
            <p>
              Built with &hearts; using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
