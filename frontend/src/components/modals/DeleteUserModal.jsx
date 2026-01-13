import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const DeleteUserModal = ({ open, setOpen, onConfirm, userName }) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 p-6 rounded-lg w-full max-w-sm text-white shadow-lg">
          <div className="flex justify-between items-start">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Delete
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{userName}</span>? This action
            cannot be undone.
          </Dialog.Description>

          <div className="mt-4 flex justify-end gap-3">
            <Dialog.Close className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 transition cursor-pointer">
              Cancel
            </Dialog.Close>
            <button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
