import { combineReducers } from 'redux';

import Navigation from './Navigations';
import UserInfor from './UserInfor';
import Store from './Store';
import SearchBox from './SearchBox';
import StoreBySearch from './StoreBySearch';
import DetailStore from './StoreById';
import Cart from './Cart';
import Vegetable from './Vegetable';
import Menu from './Menu';
import Network from './Network';

export default combineReducers({
    nav: Navigation,
    userInfor: UserInfor,
    store: Store,
    searchBox: SearchBox,
    storeBySearch: StoreBySearch,
    detailStore: DetailStore,
    cart: Cart,
    vegetable: Vegetable,
    menu: Menu,
    network: Network
});
