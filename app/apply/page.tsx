"use client";
import {Suspense} from "react";
import ApplyForm from "./ApplyForm";
export default function ApplyPage(){return <Suspense fallback={<main className="subpage"><section className="formWrap"><p>Loading application...</p></section></main>}><ApplyForm/></Suspense>}