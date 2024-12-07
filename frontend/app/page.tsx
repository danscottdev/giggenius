import { Button } from "@/components/ui/button";
import dotenv from "dotenv";

dotenv.config();
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-red-300">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Button variant="default">Button</Button>
    </div>
  );
}
