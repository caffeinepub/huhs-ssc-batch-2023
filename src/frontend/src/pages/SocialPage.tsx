import { Facebook, Globe, MessageCircle, Youtube } from "lucide-react";
import { motion } from "motion/react";
import { useGetSocialLinks } from "../hooks/useQueries";

export default function SocialPage() {
  const { data: socialLinks } = useGetSocialLinks();

  const SOCIAL_LINKS = [
    {
      name: "Facebook Group",
      description:
        "Join our official Facebook group to stay connected with all batch mates, share memories, and get the latest updates.",
      url:
        socialLinks?.facebook ||
        "https://www.facebook.com/groups/sscbatch2023huhs",
      icon: Facebook,
      color: "bg-blue-500",
      label: "Join Group",
    },
    {
      name: "YouTube Channel",
      description:
        "Subscribe to our YouTube channel for event highlights, farewell videos, and memorable moments from school life.",
      url: socialLinks?.youtube || "https://www.youtube.com/@huhs2023",
      icon: Youtube,
      color: "bg-red-500",
      label: "Subscribe",
    },
    {
      name: "WhatsApp Community",
      description:
        "Join our WhatsApp community for instant updates and communication with your batch mates.",
      url: "https://chat.whatsapp.com/sscbatch2023",
      icon: MessageCircle,
      color: "bg-green-500",
      label: "Join Community",
    },
    {
      name: "School Website",
      description:
        "Visit the official school website for academic news, admissions, and institutional updates.",
      url: "https://harishcharunionhighschool.edu.bd",
      icon: Globe,
      color: "bg-primary",
      label: "Visit Website",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Social Media Community
        </h1>
        <p className="text-muted-foreground mt-2">
          Stay connected with SSC Batch 2023 across all platforms
        </p>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden mb-10 relative h-48"
      >
        <img
          src="/assets/generated/hero-slide1.dim_1200x600.jpg"
          alt="Social Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/30 flex items-center px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Stay Connected</h2>
            <p className="text-white/80 mt-1">Join us on social media</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SOCIAL_LINKS.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">{item.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-1">
              {item.description}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {item.label}
            </a>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
