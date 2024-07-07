import { Router } from "express";

export interface controller {
    path: string,
    router: Router
}