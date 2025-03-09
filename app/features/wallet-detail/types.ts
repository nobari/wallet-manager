import {WalletDetails as WalletDetailsType} from '@/lib/bitcoin';

export type {WalletDetailsType};

export interface WalletSelectorProps {
  wallets: WalletDetailsType[];
  selectedWalletIndex: number | null;
  onSelectWallet: (index: number | null) => void;
  onRefreshBalance: (address: string) => void;
  onRemoveWallet: (index: number) => void;
}

export interface WalletHeaderProps {
  wallet: WalletDetailsType;
  balance: number | undefined;
  isRenaming: boolean;
  newName: string;
  onRename: () => void;
  onCancelRename: () => void;
  onStartRenaming: () => void;
  onNameChange: (name: string) => void;
}

export interface WalletInfoProps {
  wallet: WalletDetailsType;
  balance: number | undefined;
}

export interface WalletSendProps {
  wallet?: WalletDetailsType;
  isLoading: boolean;
  onSend: (recipientAddress: string, amount: string) => Promise<void>;
}

export interface WalletBackupProps {
  wallet: WalletDetailsType;
}

export interface WalletTabsProps {
  wallet: WalletDetailsType;
  balance: number | undefined;
  isLoading: boolean;
  onSend: (recipientAddress: string, amount: string) => Promise<void>;
  transactionRefreshTrigger?: number;
}

export interface WalletTransactionsProps {
  wallet: WalletDetailsType;
  refreshTrigger?: number;
}
