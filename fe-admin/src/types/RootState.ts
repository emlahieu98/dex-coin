import { GlobalState } from 'app/pages/AppPrivate/slice/types';
import { AuthState } from 'app/pages/Auth/slice/types';
import { ProductsState } from 'app/pages/Products/slice/types';
import { CategoriesState } from 'app/pages/Categories/slice/types';
import { TransactionsState } from 'app/pages/Accountant/Transactions/slice/types';
import { SuppliersState } from 'app/pages/Suppliers/slice/types';
import { BanksState } from 'app/pages/Banks/slice/types';
import { UsersState } from 'app/pages/Users/slice/types';
import { AdminsState } from 'app/pages/Admins/slice/types';
// import { StoresState } from 'app/pages/Stores/slice/types';
import { MyProfileState } from 'app/pages/MyProfile/slice/types';
import { SettingState } from 'app/pages/Setting/slice/types';
import { AccountantHandleDepositState } from 'app/pages/Accountant/AccountantHandleDeposit/slice/types';
import { AccountantHandleWithdrawalState } from 'app/pages/Accountant/AccountantHandleWithdrawal/slice/types';
import { AffiliateState } from 'app/pages/Accountant/AccountPartnership/slice/types';

// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly
import { ThemeState } from 'styles/theme/slice/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  theme?: ThemeState;
  global?: GlobalState;
  auth?: AuthState;
  products?: ProductsState;
  categories?: CategoriesState;
  transactions?: TransactionsState;
  suppliers?: SuppliersState;
  banks?: BanksState;
  users?: UsersState;
  admins?: AdminsState;
  // stores?: StoresState;
  myprofile?: MyProfileState;
  setting?: SettingState;
  AccountantHandleDeposit?: AccountantHandleDepositState;
  AccountantHandleWithdrawal?: AccountantHandleWithdrawalState;
  affiliate?: AffiliateState;

  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
