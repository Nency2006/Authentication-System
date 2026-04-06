import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'




const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(formData);

        try{
            setIsLoading(true);
            const res = await axios.post(`http://localhost:8000/user/register`, formData,{
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(res.data.success){
                navigate("/verify");
                toast.success(res.data.message)
            }
        }catch(error){
            console.error("Error occurred while submitting form:", error);
            toast.error("Failed to create account. Please try again.");
        }finally{
            setIsLoading(false);
        }

    }
    return (
        <div className='relative w-full h-screen md:h-[760px] bg-green-100 overflow-hidden'>
            <div className='min-h-screen flex flex-col to-muted/20'>
                <div className='flex-1 flex items-center justify-center p-4'>
                    <div className='w-full max-w-md space-y-6'>
                        <div className='text-ceter space-y-2'>
                            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Create an account</h1>
                            <p className='text-grey-600'>
                                Start Organizing your thougt and idea Today.
                            </p>
                        </div>

                        <Card className="w-full max-w-sm">
                            <CardHeader className='space-y-1'>
                                <CardTitle className='text-2xt text-center text-green-600'>Sign Up</CardTitle>
                                <CardDescription className='text-center'>
                                    Create your account to get started with our note-taking app.
                                </CardDescription>

                            </CardHeader>
                            <CardContent>
                                
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="fullname">Full Name</Label>
                                            <Input
                                                id="fullname"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">Password</Label>
                                            <div className="relative">
                                                <Input id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    type={showPassword ? "text" : "password"}
                                                    required placeholder="Enter your password" />
                                            </div>

                                        </div>
                                    </div>
                                
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button onClick={handleSubmit} type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white">
                                    {
                                        isLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 animate-spin' />
                                                creating account....
                                            </>
                                        ) : "Sign Up"
                                    }
                                </Button>

                            </CardFooter>
                        </Card>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
