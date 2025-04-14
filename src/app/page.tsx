"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendWhatsappMessage, WhatsappMessage } from "@/services/whatsapp";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const processCSV = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    if (!link) {
      toast({
        title: "Error",
        description: "Please enter the offer link.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    setStatus(["Processing..."]);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          const row: { [key: string]: string } = {};
          for (let j = 0; j < headers.length; j++) {
            row[headers[j].trim()] = values[j]?.trim() || "";
          }
          data.push(row);
        }

        const newStatus: string[] = [];
        console.log(data);
        for (const row of data) {
          try {
            if (!row.phone) {
              console.log('User null...')
              continue;
            }

            const whatsappMessage: WhatsappMessage = {
              phoneNumber: row.phone,
              message: `Olá tudo bem?\nVi que você está no grupo ${row.group}, por isso fui falar com voce\nTemos a seguinte oferta ${link}`,
            };

            const success = await sendWhatsappMessage(whatsappMessage);

            if (success) {
              newStatus.push(`Message sent successfully to ${row.name} (${row.phone}).`);
            } else {
              newStatus.push(`Failed to send message to ${row.name} (${row.phone}).`);
            }
          } catch (error: any) {
            newStatus.push(`Error sending message to ${row.name} (${row.phone}): ${error.message}`);
          }
          setStatus([...newStatus]);
        }

        setStatus(newStatus);
        setIsProcessing(false);
        toast({
          title: "Success",
          description: "Processing complete!",
          duration: 3000,
        });
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md space-y-4">
        <CardHeader>
          <CardTitle>Mensagens automaticas WhatsApp</CardTitle>
          <CardDescription>
            Suba seu arquivo CSV e digite o link da sua oferta.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <label
              htmlFor="csv-upload"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Arquivo CSV
            </label>
            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          <div>
            <label
              htmlFor="offer-link"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Link da oferta
            </label>
            <Input
              type="text"
              id="offer-link"
              placeholder="https://example.com/offer"
              value={link}
              onChange={handleLinkChange}
            />
          </div>
          <Button onClick={processCSV} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Enviar mensagens"}
          </Button>
        </CardContent>
      </Card>

      {status.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          {status.map((message, index) => (
            <Alert key={index} className="mb-2" variant={message.startsWith("Error") ? "destructive" : "default"}>
              {message.startsWith("Error") ? (
                <>
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </>
              )}
            </Alert>
          ))}
        </div>
      )}
       <Toaster/>
    </div>
  );
}
