import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_CreateRegisterPost from './handle/CreateRegisterPost';
import Handle_EditRegisterPost from './handle/EditRegisterPost';
import Handle_DeleteRegisterPost from './handle/DeleteRegisterPost';
import Handle_CreatePost from './handle/CreatePost';
import Handle_EditPost from './handle/EditPost';

dotenv.config();

const router_mutate_post: Router = express.Router();
const handle_createRegisterPost = new Handle_CreateRegisterPost();
const handle_editRegisterPost = new Handle_EditRegisterPost();
const handle_deleteRegisterPost = new Handle_DeleteRegisterPost();
const handle_createPost = new Handle_CreatePost();
const handle_editPost = new Handle_EditPost();

router_mutate_post.post(
    '/createRegisterPost',
    authentication,
    handle_createRegisterPost.setup,
    handle_createRegisterPost.main
);

router_mutate_post.post(
    '/editRegisterPost',
    authentication,
    handle_editRegisterPost.setup,
    handle_editRegisterPost.main
);

router_mutate_post.post(
    '/deleteRegisterPost',
    authentication,
    handle_deleteRegisterPost.setup,
    handle_deleteRegisterPost.main
);

router_mutate_post.post('/createPost', authentication, handle_createPost.setup, handle_createPost.main);

router_mutate_post.post('/editPost', authentication, handle_editPost.setup, handle_editPost.main);

export default router_mutate_post;
