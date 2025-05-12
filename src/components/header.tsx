import Link from "next/link";
import AccountTab from "./account";
import styles from "./header.module.css"

export default function Header() {
  return (
    <header className={styles.header}>
        <Link href="/" className="">
            <h1 className={styles.headerText}>Projects</h1>
        </Link>
        <AccountTab />
    </header>
  );
}