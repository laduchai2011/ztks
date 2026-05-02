import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from '@src/screen/Signup';
import Signin from '@src/screen/Signin';
import Signout from '@src/screen/Signout';
import ForgetPassword from '@src/screen/ForgetPassword';
import Home1 from '@src/screen/Home1';
import Message1 from '@src/screen/Message1';
import SupportRoom from '@src/screen/SupportRoom';
import Note from '@src/screen/Note';
import Profile from '@src/screen/Profile';
import NotFoundPage from '@src/screen/NotFoundPage';
import Oa from '@src/screen/Oa';
import OaSetting from '@src/screen/OaSetting';
import Order from '@src/screen/Order';
import AccountReceiveMessage from '@src/screen/AccountReceiveMessage';
import ManageAgent from '@src/screen/ManageAgent';
import Member from '@src/screen/Member';
import Wallet from '@src/screen/Wallet';
import Zns from '@src/screen/Zns';
import Bank from '@src/screen/Bank';
import Post from '@src/screen/Post';
import RegisterPost from '@src/screen/RegisterPost';
import Leave from '@src/screen/Leave';
import { route_enum } from './type';

const router = createBrowserRouter(
    [
        { path: route_enum.SIGNUP, element: <Signup /> },
        { path: route_enum.SIGNIN, element: <Signin /> },
        { path: route_enum.SIGNOUT, element: <Signout /> },
        { path: route_enum.FORGET_PASSWORD, element: <ForgetPassword /> },
        { path: route_enum.HOME, element: <Home1 /> },
        { path: route_enum.MESSAGE1 + '/:id', element: <Message1 /> },
        { path: route_enum.SUPPORT_ROOM, element: <SupportRoom /> },
        { path: route_enum.NOTE, element: <Note /> },
        { path: route_enum.PROFILE, element: <Profile /> },
        { path: route_enum.OA, element: <Oa /> },
        { path: route_enum.OA_SETTING + '/:id', element: <OaSetting /> },
        { path: route_enum.ORDER, element: <Order /> },
        { path: route_enum.ACCOUNT_RECEIVE_MESSAGE, element: <AccountReceiveMessage /> },
        { path: route_enum.MANAGE_AGENT, element: <ManageAgent /> },
        { path: route_enum.MEMBER, element: <Member /> },
        { path: route_enum.WALLET, element: <Wallet /> },
        { path: route_enum.ZNS, element: <Zns /> },
        { path: route_enum.BANK, element: <Bank /> },
        { path: route_enum.POST, element: <Post /> },
        { path: route_enum.REGISTER_POST, element: <RegisterPost /> },
        { path: route_enum.LEAVE, element: <Leave /> },
        { path: '*', element: <NotFoundPage /> }, // Trang 404
    ],
    {
        future: { v7_startTransition: true } as any,
    }
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
