"use client";

import { useEffect, useRef, type SyntheticEvent } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./EditTransactionModal.module.scss";

type TransactionType = "income" | "expense";

interface EditTransactionFormData {
  readonly date: string;
  readonly description: string;
  readonly type: TransactionType | "";
  readonly amount: string;
}

interface EditTransactionModalProps {
  readonly formData: EditTransactionFormData;
  readonly isMutating: boolean;
  readonly isSubmitDisabled: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
  readonly onFormDataChange: (formData: EditTransactionFormData) => void;
}

export default function EditTransactionModal({
  formData,
  isMutating,
  isSubmitDisabled,
  onClose,
  onSubmit,
  onFormDataChange,
}: EditTransactionModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog && !isMutating) {
        onClose();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);

    if (!dialog.open) {
      dialog.showModal();
    }

    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isMutating, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-labelledby="edit-transaction-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!isMutating) {
          onClose();
        }
      }}
    >
      <section className={styles.modalContent}>
        <section className={styles.modalHeader}>
          <h2 id="edit-transaction-title" className={styles.modalTitle}>
            Editar Transação
          </h2>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar modal de edição"
            disabled={isMutating}
          >
            <IoClose />
          </button>
        </section>

        <form id="editForm" className={styles.modalForm} onSubmit={onSubmit}>
          <section className={styles.inputGroup}>
            <label htmlFor="edit-transaction-date">Data</label>
            <input
              id="edit-transaction-date"
              type="date"
              value={formData.date}
              disabled={isMutating}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  date: event.target.value,
                })
              }
              required
            />
          </section>

          <section className={styles.inputGroup}>
            <label htmlFor="edit-transaction-description">Descrição</label>
            <input
              id="edit-transaction-description"
              type="text"
              value={formData.description}
              disabled={isMutating}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  description: event.target.value,
                })
              }
              required
            />
          </section>

          <section className={styles.inputGroup}>
            <label htmlFor="edit-transaction-type">Categoria</label>
            <select
              id="edit-transaction-type"
              value={formData.type}
              disabled={isMutating}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  type: event.target.value as TransactionType | "",
                })
              }
              required
            >
              <option value="">Selecione</option>
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </section>

          <section className={styles.inputGroup}>
            <label htmlFor="edit-transaction-amount">Valor</label>
            <input
              id="edit-transaction-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              disabled={isMutating}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  amount: event.target.value,
                })
              }
              required
            />
          </section>

          <section className={styles.modalActions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmitDisabled}
            >
              Salvar Alterações
            </button>
          </section>
        </form>
      </section>
    </dialog>
  );
}
