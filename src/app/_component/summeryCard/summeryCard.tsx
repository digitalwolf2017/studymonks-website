import React from 'react';
import styles from "./summeryCard.module.scss";

export default function SummeryCard() {
    return (
        <div className={styles.summeryWrapper}>
            <h2>Summary Generated with AI <span>Sat, 30 Aug 2025 11:30 am - 12:17 pm</span></h2>
            <div className={styles.textWrap}>
                <p>Overview</p>

                <p>In this language arts tutoring session, Bhavya and Myra covered various grammar concepts
                    including parentheses, active and passive voice, clauses, and metaphors through detailed
                    explanations and practice exercises. They worked through specific examples and practice
                    questions to help Myra understand and apply these language concepts, particularly focusing
                    on how parentheses provide additional context and how different sentence structures affect
                    meaning. The session concluded with administrative matters regarding practice sheets and a
                    brief discussion about Myra's daughter's school situation and future tutoring arrangements.</p>

                <p>Language Focus and Punctuation Review</p>

                <p>Bhavya and Myra discussed Myra's new school and books. They reviewed a language focus
                    sheet covering punctuation and clauses. Bhavya explained the concept of parenthesis to Myra,
                    who had not been taught it yet. They read and analyzed a short passage about a young
                    inventor named Alex, with Bhavya guiding Myra through the questions and explanations on the
                    sheet.</p>

                <p>Understanding Parentheses in Writing</p>

                <p>Bhavya explained the purpose of parentheses to Myra, covering three main uses: adding extra
                    information, making side comments, and defining acronyms. She emphasized that parentheses
                    do not change the core meaning of a sentence and provided examples to illustrate each point.
                    The lesson concluded with Bhavya guiding Myra to analyze a text extract, asking her to identify
                    the information with
                </p>

            </div>
        </div>
    )
}
