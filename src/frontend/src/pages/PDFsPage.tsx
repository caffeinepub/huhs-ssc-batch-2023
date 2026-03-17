import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, ExternalLink, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useGetAllPDFs } from "../hooks/useQueries";

export default function PDFsPage() {
  const { data: pdfs, isLoading } = useGetAllPDFs();

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">PDF Documents</h1>
        <p className="text-muted-foreground mt-2">
          Study materials, guides, and official documents
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4" data-ocid="pdfs.loading_state">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-5 shadow-card flex gap-4"
            >
              <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : !pdfs || pdfs.length === 0 ? (
        <div className="text-center py-16" data-ocid="pdfs.empty_state">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No documents available yet.</p>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="pdfs.list">
          {pdfs.map((pdf, i) => (
            <motion.div
              key={pdf.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4"
              data-ocid={`pdfs.item.${i + 1}`}
            >
              <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{pdf.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {pdf.description}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  data-ocid={`pdfs.view.button.${i + 1}`}
                >
                  <a
                    href={pdf.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  asChild
                  data-ocid={`pdfs.download.button.${i + 1}`}
                >
                  <a href={pdf.fileUrl} download className="gap-1">
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
