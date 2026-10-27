import React from "react";
import styles from "./subjectCard.module.scss";
import Image from "next/image";
import Link from "next/link";

interface SubjectCardProps {
  title: string;
  classes: number;
  image: string;
  link: string;
  isPaid: boolean;
}

export default function SubjectCard({
  title,
  classes,
  image,
  link,
  isPaid,
}: SubjectCardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardImage}>
        <Image src={image} width={380} height={205} alt={title} />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardText}>
          <h3>{title}</h3>
          <p>{classes} Scheduled Live Classes</p>
        </div>
        {isPaid ? (
          <Link href={link} className="button">
            Start Studying
          </Link>
        ) : (
          <Link href="/subscription" className="button">
            Buy Now
          </Link>
        )}
      </div>
    </div>
  );
}
