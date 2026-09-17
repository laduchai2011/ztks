import express, { Router } from 'express';
import dotenv from 'dotenv';
import authentication from '@src/auth';
import Handle_Create_Register_Post from './handle/Create_Register_Post';
import Handle_Edit_Register_Post from './handle/Edit_Register_Post';
import Handle_Delete_Register_Post from './handle/Delete_Register_Post';
import Handle_Create_Post from './handle/Create_Post';
import Handle_Edit_Post from './handle/Edit_Post';

dotenv.config();

const router_mutate_post: Router = express.Router();
const handle_create_register_post = new Handle_Create_Register_Post();
const handle_edit_register_post = new Handle_Edit_Register_Post();
const handle_delete_register_post = new Handle_Delete_Register_Post();
const handle_create_post = new Handle_Create_Post();
const handle_edit_post = new Handle_Edit_Post();

router_mutate_post.post(
    '/create_register_post',
    authentication,
    handle_create_register_post.setup,
    handle_create_register_post.main
);

router_mutate_post.post(
    '/edit_register_post',
    authentication,
    handle_edit_register_post.setup,
    handle_edit_register_post.main
);

router_mutate_post.post(
    '/delete_register_post',
    authentication,
    handle_delete_register_post.setup,
    handle_delete_register_post.main
);

router_mutate_post.post('/create_post', authentication, handle_create_post.setup, handle_create_post.main);

router_mutate_post.post('/edit_post', authentication, handle_edit_post.setup, handle_edit_post.main);

export default router_mutate_post;
