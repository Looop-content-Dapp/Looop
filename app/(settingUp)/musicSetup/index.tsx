import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(settingUp)/musicSetup/(steps)/artists");
  }, []);

  return null;
}
