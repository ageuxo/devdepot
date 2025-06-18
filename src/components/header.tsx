import Link from "next/link";
import AccountTab from "./account";
import styles from "./header.module.css"
import Image from "next/image";
import logo from './logo.png'

export default function Header() {
  return (
    <header className={styles.header}>
        <Image src={logo} alt="DevDepot logo" width={25} height={25} />
        <Link href="/" className="">
            <h1 className={styles.headerText}>Projects</h1>
        </Link>
        <AccountTab />
    </header>
  );
}