import { Facebook, Globe, MessageCircle, Youtube } from "lucide-react";
import { motion } from "motion/react";

const SOCIAL_LINKS = [
  {
    name: "Facebook Group",
    description:
      "Join our official Facebook group to stay connected with all batch mates, share memories, and get the latest updates.",
    url: "https://www.facebook.com/groups/sscbatch2023huhs",
    icon: Facebook,
    color: "bg-blue-500",
    label: "Join Group",
  },
  {
    name: "YouTube Channel",
    description:
      "Subscribe to our YouTube channel for event highlights, farewell videos, and memorable moments from school life.",
    url: "https://www.youtube.com/@huhs2023",
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

export default function SocialPage() {
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
          alt="Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay flex flex-col justify-center pl-8">
          <h2 className="text-white text-2xl font-bold">
            Our Online Community
          </h2>
          <p className="text-white/80 text-sm mt-1 max-w-sm">
            Connected beyond graduation – SSC Batch 2023
          </p>
        </div>
      </motion.div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        data-ocid="social.list"
      >
        {SOCIAL_LINKS.map((social, i) => {
          const Icon = social.icon;
          return (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              data-ocid={`social.item.${i + 1}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {social.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {social.description}
                  </p>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-sm font-medium text-white ${social.color} px-4 py-2 rounded-full hover:opacity-90 transition-opacity`}
                    data-ocid={`social.${social.name.toLowerCase().replace(/\s+/g, "_")}.button`}
                  >
                    {social.label}
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
