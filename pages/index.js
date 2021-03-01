import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
function IndexPage() {
    const router = useRouter()
    useEffect(()=> {
        router.push("/orders")
    })

    return null
}
export default IndexPage