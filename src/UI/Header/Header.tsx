import "./Header.scss";

import Image from "next/image";


type Props = {
    children: React.ReactNode
}

export default function Header({ children }: Props) {
    return (
        <>
            <header>
                <div className="logo-section">
                    <Image 
                        src="/img/imperial-logo.png"
                        width={64}
                        height={64}
                        alt=""
                    />
                    <h2>Chemistry helper</h2>
                </div>
            </header>
            <main>
                {children}
            </main>
        </>
    )
}