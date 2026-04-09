import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from '@src/screen/Signup';
import Signin from '@src/screen/Signin';
// import Signout from '@src/screen/Signout';
import ForgetPassword from '@src/screen/ForgetPassword';
import Home from '@src/screen/Home';
import Voucher from '@src/screen/Voucher';
import Order from '@src/screen/Order';
import NotFoundPage from '@src/screen/NotFoundPage';

import { route_enum } from './type';

const router = createBrowserRouter(
    [
        { path: route_enum.SIGNUP, element: <Signup /> },
        { path: route_enum.SIGNIN, element: <Signin /> },
        // { path: route_enum.SIGNOUT, element: <Signout /> },
        { path: route_enum.FORGET_PASSWORD, element: <ForgetPassword /> },
        { path: route_enum.HOME, element: <Home /> },
        { path: route_enum.VOUCHER, element: <Voucher /> },
        { path: route_enum.ORDER, element: <Order /> },

        { path: '*', element: <NotFoundPage /> }, // Trang 404
    ],
    {
        future: { v7_startTransition: true } as any,
    }
);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
