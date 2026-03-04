"use client";

import { useEffect, useState } from "react";
import styles from "./AccountSettingsModal.module.scss";

type AccountSettingsModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly userName: string;
  readonly userEmail?: string;
};

export default function AccountSettingsModal({
  isOpen,
  onClose,
  userName,
  userEmail,
}: AccountSettingsModalProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setIsDeleteConfirmOpen(false);
      setDeletePassword("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <section className={styles.settingsModalLayer}>
      <button
        type="button"
        className={styles.settingsModalOverlay}
        onClick={onClose}
        aria-label="Fechar configurações da conta"
      />
      <dialog
        open
        className={styles.settingsModal}
        aria-labelledby="account-settings-title"
        onCancel={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <h2 id="account-settings-title" className={styles.settingsTitle}>
          Configurações da Conta
        </h2>

        <p className={styles.settingsUserInfo}>
          Usuário: <strong>{userName}</strong>
          {userEmail ? ` (${userEmail})` : ""}
        </p>

        <section className={styles.dangerZone}>
          <h3 className={styles.dangerZoneTitle}>Zona de Perigo</h3>
          <p className={styles.dangerZoneDescription}>
            A exclusão da conta é permanente. Todos os seus dados serão
            apagados.
          </p>

          {isDeleteConfirmOpen ? (
            <section className={styles.deleteConfirmWrap}>
              <label
                htmlFor="delete-account-password"
                className={styles.passwordLabel}
              >
                Confirme sua senha atual:
              </label>
              <input
                id="delete-account-password"
                type="password"
                className={styles.passwordInput}
                placeholder="Sua senha"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                autoComplete="current-password"
              />
              <section className={styles.deleteActions}>
                <button
                  type="button"
                  className={styles.cancelDeleteButton}
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setDeletePassword("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.confirmDeleteButton}
                  disabled={!deletePassword.trim()}
                  onClick={onClose}
                >
                  Confirmar Exclusão
                </button>
              </section>
            </section>
          ) : (
            <button
              type="button"
              className={styles.deleteAccountButton}
              onClick={() => setIsDeleteConfirmOpen(true)}
            >
              Excluir minha conta
            </button>
          )}
        </section>
      </dialog>
    </section>
  );
}
