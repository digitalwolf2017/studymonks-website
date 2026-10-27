"use client";

import { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import Image from "next/image";
import PopupForm from "../component/PopupForm";

type Stage = "stage4" | "stage5" | "stage6" | "stage7" | "stage8" | "stage9";

interface StagePrice {
  math: number;
  english: number;
  science: number;
  twoSavingsPercent: number;
  threeSavingsPercent: number;
  twoSavingsLabel: string;
  threeSavingsLabel: string;
}

const pricingData: Record<Stage, StagePrice> = {
  stage4: {
    math: 2490,
    english: 4290,
    science: 5590,
    twoSavingsPercent: 14,
    threeSavingsPercent: 25,
    twoSavingsLabel: "~14% Savings",
    threeSavingsLabel: "~25% Savings",
  },
  stage5: {
    math: 2690,
    english: 4590,
    science: 6090,
    twoSavingsPercent: 15,
    threeSavingsPercent: 25,
    twoSavingsLabel: "~15% Savings",
    threeSavingsLabel: "~25% Savings",
  },
  stage6: {
    math: 2890,
    english: 4990,
    science: 6490,
    twoSavingsPercent: 14,
    threeSavingsPercent: 25,
    twoSavingsLabel: "~14% Savings",
    threeSavingsLabel: "~25% Savings",
  },
  stage7: {
    math: 3190,
    english: 5490,
    science: 7190,
    twoSavingsPercent: 14,
    threeSavingsPercent: 25,
    twoSavingsLabel: "~14% Savings",
    threeSavingsLabel: "~25% Savings",
  },
  stage8: {
    math: 3490,
    english: 5990,
    science: 7890,
    twoSavingsPercent: 14,
    threeSavingsPercent: 25,
    twoSavingsLabel: "~14% Savings",
    threeSavingsLabel: "~25% Savings",
  },
  stage9: {
    math: 3790,
    english: 6490,
    science: 8490,
    twoSavingsPercent: 15,
    threeSavingsPercent: 25,
    twoSavingsLabel: "~15% Savings",
    threeSavingsLabel: "~25% Savings",
  },
};

export default function StagePricingDetailed() {
  const [activeStage, setActiveStage] = useState<Stage>("stage4");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const stageInfo = pricingData[activeStage];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const formatINR = (value: number) =>
    value.toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const subjectPrice = (subject: string) => {
    switch (subject) {
      case "Math":
        return stageInfo.math;
      case "English":
        return stageInfo.english;
      case "Science":
        return stageInfo.science;
      default:
        return 0;
    }
  };

  const subjectDescriptions: Record<string, string> = {
    Math: "Builds strong problem-solving skills.",
    English: "Develops powerful communication.",
    Science: "Sparks curiosity and discovery.",
  };

  const subtotal = selectedSubjects.reduce(
    (sum, s) => sum + subjectPrice(s),
    0
  );
  const subjectCount = selectedSubjects.length;

  const discountPercent =
    subjectCount === 2
      ? stageInfo.twoSavingsPercent
      : subjectCount === 3
      ? stageInfo.threeSavingsPercent
      : 0;

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const getHeading = () => {
    if (subjectCount === 1) return "Single Subject Plan (Monthly Fee)";
    if (subjectCount === 2)
      return "Two-Subject Bundle (Monthly Fee & Discount)";
    if (subjectCount === 3)
      return 'Three-Subject "Achiever" Bundle (Monthly Fee & Discount)';
    return "Build a Custom Plan";
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <section className="tab-sec mb" id="price">
      <Container className="my-5">
        {/* ✅ Always show tabs (removed mobile dropdown) */}
        <div className="mb-5">
          <Nav
            variant="tabs"
            activeKey={activeStage}
            onSelect={(selectedKey) => setActiveStage(selectedKey as Stage)}
          >
            <Nav.Item>
              <Nav.Link eventKey="stage4">Stage 4</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stage5">Stage 5</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stage6">Stage 6</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stage7">Stage 7</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stage8">Stage 8</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stage9">Stage 9</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Row className="align-items-stretch">
          <Col md={6}>
            <div className="gr-jg">
              <div className="text-center">
                <h3 id="pyhs">The Ultimate Advantage Package</h3>
                <p>
                  For the parent committed to providing a decisive academic
                  edge.
                </p>
                <p>
                  This holistic package fosters unshakeable confidence and a
                  lifelong love of learning that goes far beyond exams.
                </p>
                <div className="d-flex bgfxz justify-content-center">
                  {["Math", "English", "Science"].map((s) => (
                    <div
                      key={s}
                      className="fw-bold text-success d-flex mathc mx-2 align-items-center"
                    >
                      <Image
                        src="/assets/img/tick-circle2.png"
                        alt="tick"
                        width={25}
                        height={25}
                        className="me-2"
                      />
                      <h5 className="fw-bold text-success m-0">{s}</h5>
                    </div>
                  ))}
                </div>

                <div className="twelvex mt-3">
                  <p>Monthly Price</p>
                  <h3 id="pyhs" className="mb-2">
                    ₹12,000
                  </h3>
                  <p>
                    You save ₹370 every month (that&apos;s{" "}
                    <span className="text-success">₹4,440</span> a year!)
                  </p>
                </div>
                <button className="btn-frd mt-3" onClick={handleClickOpen}>
                  Claim Your Child’s 7 Day Free Trial
                </button>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="secd-bcx text-center">
              <h3 id="pyhs" className="mb-2">
                {getHeading()}
              </h3>
              <p>Focus on specific areas with a flexible plan you design.</p>

              <div
                className="text-start mt-3"
                style={{ maxWidth: 520, margin: "0 auto" }}
              >
                {(["Math", "English", "Science"] as string[]).map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <div
                      key={sub}
                      className={`d-flex align-items-center justify-content-between mb-3 p-3 rounded-4`}
                      style={{
                        background: isSelected ? "#F3FFF2" : "#F3F8FF",
                        border: isSelected
                          ? "1px solid #198754"
                          : "2px solid transparent", // ✅ added
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => toggleSubject(sub)}
                    >
                      <div className="d-flex align-items-start">
                        <div style={{ paddingRight: 12, paddingTop: 4 }}>
                          <Image
                            src="/assets/img/tick-circle2.png"
                            alt="tick"
                            width={22}
                            height={22}
                          />
                        </div>

                        <div>
                          <div
                            className="monthg"
                            style={{
                              fontWeight: 600,
                              color: isSelected ? "#198754" : "#001F3F", // ✅ subject text color change
                            }}
                          >
                            {sub}
                          </div>
                          <div style={{ color: "#6c757d", fontSize: 14 }}>
                            {subjectDescriptions[sub]}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          color: isSelected ? "#198754" : "#01356C", // ✅ price color match
                        }}
                      >
                        ₹{formatINR(subjectPrice(sub))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{ maxWidth: 520, margin: "10px auto 0" }}
                className="text-start"
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ padding: "10px 16px" }}
                >
                  <div style={{ color: "#6c757d" }}>Your monthly plan</div>

                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#01356C",
                    }}
                  >
                    {subjectCount > 0 ? `₹${formatINR(finalTotal)}` : `—`}
                  </div>
                </div>

                {subjectCount === 0 ? null : (
                  <>
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ padding: "6px 16px", color: "#198754" }}
                    >
                      <div style={{ fontSize: 14 }}>
                        You got <strong>{discountPercent}%</strong> savings on
                        this bundle
                      </div>
                      <div style={{ fontWeight: 700, color: "#01356C" }}>
                        - ₹{formatINR(discountAmount)}
                      </div>
                    </div>

                    <hr
                      style={{
                        borderTop: "1px solid #e9eef3",
                        margin: "12px 0",
                      }}
                    />
                  </>
                )}

                <div className="text-center mt-3">
                  <button className="mentr" onClick={handleClickOpen}>
                    Claim Your Child’s 7 Day Free Trial
                  </button>
                </div>
              </div>
            </div>
            <PopupForm open={open} handleClose={handleClose} />
          </Col>
        </Row>

        <div className="text-center mt-4">
          <p className="notex">
            <b>Please Note:</b> Enrollment for the current term is closing soon.
            Limited spots available.
          </p>
        </div>
      </Container>
    </section>
  );
}
