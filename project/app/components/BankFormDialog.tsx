import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useRouter } from "next/navigation"

import { RegistrationForm } from "./BankForm"

export function RegisterDialog({open, setOpen}) {
  const router = useRouter();

  const handleCloseDialog = () => {
    setOpen(false);
    router.refresh();
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add A Bank Account</DialogTitle>
          <DialogDescription>
           Add multiple accounts that can be used for transactions! 
          </DialogDescription>
        </DialogHeader>
        <RegistrationForm onSave={handleCloseDialog}/>
      </DialogContent>
    </Dialog>
  )
}
