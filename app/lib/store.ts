import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {WalletDetails} from './bitcoin';

interface WalletState {
  wallets: WalletDetails[];
  selectedWalletIndex: number | null;
  balances: {[address: string]: number};
  addWallet: (wallet: WalletDetails) => void;
  selectWallet: (index: number | null) => void;
  setBalance: (address: string, balance: number) => void;
  getSelectedWallet: () => WalletDetails | null;
  renameWallet: (index: number, name: string) => void;
  removeWallet: (index: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      wallets: [],
      selectedWalletIndex: null,
      balances: {},
      addWallet: (wallet) =>
        set((state) => ({
          wallets: [...state.wallets, wallet],
          selectedWalletIndex:
            state.selectedWalletIndex === null
              ? state.wallets.length
              : state.selectedWalletIndex
        })),
      selectWallet: (index) => set({selectedWalletIndex: index}),
      setBalance: (address, balance) =>
        set((state) => ({
          balances: {...state.balances, [address]: balance}
        })),
      getSelectedWallet: () => {
        const {wallets, selectedWalletIndex} = get();
        return selectedWalletIndex !== null
          ? wallets[selectedWalletIndex]
          : null;
      },
      renameWallet: (index, name) =>
        set((state) => ({
          wallets: state.wallets.map((wallet, i) =>
            i === index ? {...wallet, name} : wallet
          )
        })),
      removeWallet: (index) =>
        set((state) => {
          const newWallets = state.wallets.filter((_, i) => i !== index);
          let newSelectedIndex = state.selectedWalletIndex;

          // Adjust selected wallet index if needed
          if (newWallets.length === 0) {
            newSelectedIndex = null;
          } else if (state.selectedWalletIndex !== null) {
            if (index === state.selectedWalletIndex) {
              // If we're removing the selected wallet, select the first one
              newSelectedIndex = newWallets.length > 0 ? 0 : null;
            } else if (index < state.selectedWalletIndex) {
              // If we're removing a wallet before the selected one, decrement the index
              newSelectedIndex = state.selectedWalletIndex - 1;
            }
          }

          return {
            wallets: newWallets,
            selectedWalletIndex: newSelectedIndex
          };
        })
    }),
    {
      name: 'wallet-storage'
    }
  )
);
