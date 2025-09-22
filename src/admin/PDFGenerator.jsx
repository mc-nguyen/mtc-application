// src/admin/PDFGenerator.jsx
import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';

// Import hình ảnh từ thư mục assets
import tnttLogo from '../assets/tntt.png';
import churchLogo from '../assets/favicon.png';

// // Đăng ký font hỗ trợ tiếng Việt
Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: '/fonts/Roboto-Regular.ttf',
            fontWeight: 'normal',
            fontStyle: 'normal',
        },
        {
            src: '/fonts/Roboto-Bold.ttf',
            fontWeight: 'bold',
            fontStyle: 'normal',
        },
        {
            src: '/fonts/Roboto-Italic.ttf',
            fontWeight: 'normal',
            fontStyle: 'italic',
        },
    ],
});

// // Hoặc sử dụng font có sẵn trong hệ thống hỗ trợ tiếng Việt
Font.registerHyphenationCallback(word => [word]);

// Tạo styles cho PDF với font hỗ trợ tiếng Việt
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 10,
        fontFamily: 'Roboto', // Sử dụng font đã đăng ký
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingBottom: 15,
        borderBottom: '2 solid #4facfe',
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4facfe',
        textAlign: 'center',
        marginBottom: 3,
    },
    headerSubtitle: {
        fontSize: 10,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 2,
    },
    headerText: {
        fontSize: 8,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 1,
    },
    headerIcon: {
        width: 70,
        height: 70,
        marginHorizontal: 10,
    },
    section: {
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
        padding: 8,
        textAlign: 'center',
    },
    subsectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4facfe',
        marginBottom: 8,
        marginTop: 12,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
        flexWrap: 'wrap',
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#555555',
        width: '35%',
    },
    value: {
        fontSize: 10,
        color: '#333333',
        width: '65%',
    },
    fullWidth: {
        width: '100%',
    },
    note: {
        fontSize: 8,
        color: '#666666',
        fontStyle: 'italic',
        marginTop: 5,
    },
    signatureSection: {
        marginTop: 20,
        marginBottom: 15,
    },
    waiverText: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 8,
        lineHeight: 1.4,
    },
    waiverSection: {
        marginBottom: 10,
    },
    waiverTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4facfe',
        marginBottom: 6,
    },
    waiverAgreement: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    rulesList: {
        marginLeft: 15,
        marginBottom: 8,
    },
    ruleItem: {
        fontSize: 9,
        color: '#333333',
        marginBottom: 4,
        lineHeight: 1.4,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#666666',
    },
    field: {
        fontSize: 9,
        color: "#999999",
        fontStyle: "italic",
        marginBottom: 4,
    },
});

const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Header Component cho tất cả các trang
const PDFHeader = () => (
    <View style={styles.header}>
        {/* Left Icon - TNTT Logo */}
        <Image
            style={styles.headerIcon}
            src={tnttLogo}
        />

        <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>PHONG TRÀO THIẾU NHI THÁNH THỂ VIỆT NAM TẠI HOA KỲ</Text>
            <Text style={styles.headerSubtitle}>The Vietnamese Eucharistic Youth Movement in the U.S.A</Text>
            <Text style={styles.headerText}>Our Lady of Perpetual Help Church - Giáo Xứ Đức Mẹ Hằng Cứu Giúp</Text>
            <Text style={styles.headerText}>Liên Đoàn Sinai | Đoàn Mẹ Thiên Chúa | Riverside, CA</Text>
            <Text style={styles.headerText}>5250 Central Avenue, Riverside, CA 92504</Text>
            <Text style={styles.headerText}>Cha Tuyên Úy: Linh mục Giuse Nguyễn Văn A | Đoàn Trưởng: Nguyễn Văn B (951) 123-4567</Text>
        </View>

        {/* Right Icon - Church Logo */}
        <Image
            style={styles.headerIcon}
            src={churchLogo}
        />
    </View>
);

// Trang 1: Main Info và Payment (Tiếng Việt)
const Page1MainInfo = ({ member, isCamp }) => (
    <Page size="A4" style={styles.page}>
        <PDFHeader />
        <Text style={styles.sectionTitle}>THÔNG TIN ĐĂNG KÝ {isCamp ? 'TRẠI BÌNH MINH' : 'THÀNH VIÊN'}</Text>

        <View style={styles.section}>
            <Text style={styles.subsectionTitle}>THÔNG TIN CÁ NHÂN</Text>
            <View style={styles.row}>
                <Text style={styles.label}>Tên Thánh & Họ Tên: </Text>
                <Text style={styles.value}>{`${member.mainInfo.saintName || ''} ${member.mainInfo.lastName || ''} ${member.mainInfo.middleName || ''} ${member.mainInfo.givenName || ''}`}</Text>
            </View>
            {!member.isAdult && (
                <>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tên Bố:</Text>
                        <Text style={styles.value}>{member.mainInfo?.fatherName || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tên Mẹ:</Text>
                        <Text style={styles.value}>{member.mainInfo?.motherName || 'N/A'}</Text>
                    </View>
                </>
            )}
            <View style={styles.row}>
                <Text style={styles.label}>Ngày sinh:</Text>
                <Text style={styles.value}>{member.dob || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{member.mainInfo?.email || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Số điện thoại:</Text>
                <Text style={styles.value}>(Home) {member.mainInfo?.homePhone || 'N/A'} - (Cell) {member.mainInfo?.cellPhone || 'N/A'} - (Work) {member.mainInfo?.workPhone || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Liên lạc khẩn cấp:</Text>
                <Text style={styles.value}>{member.mainInfo?.emergencyContactName + " (" + member.mainInfo?.emergencyContactPhone + ")" || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Địa chỉ: </Text>
                <Text style={styles.value}>{`${member.mainInfo.streetAddress || ''}, ${member.mainInfo.city || ''}, ${member.mainInfo.state || ''} ${member.mainInfo.zip || ''}`}</Text>
            </View>
            {member.mainInfo?.nganh && (
                <View style={styles.row}>
                    <Text style={styles.label}>Ngành:</Text>
                    <Text style={styles.value}>{member.mainInfo.nganh}</Text>
                </View>
            )}
        </View>

        <View style={styles.section}>
            <Text style={styles.subsectionTitle}>CHỮ KÝ/SIGNATURE(S)</Text>

            <View style={styles.section}>
                {/* Participant signature */}
                <Text style={styles.waiverAgreement}>Em xin được ghi danh gia nhập phong trào TNTT tại <Text style={{ backgroundColor: "yellow" }}>Đoàn TNTT Mẹ Thiên Chúa, Riverside</Text>. Em hứa sẽ vâng lời và theo sự hướng dẫn của cha Tuyên Úy Đoàn, Đoàn Trưởng, các trợ tá, các phụ huynh cũng như các anh chị huynh trưởng có trách nhiệm trong đoàn và trong ngành mà em sinh hoạt hằng tuần. Em sẽ cố gắng sống 4 khẩu hiệu của Thiếu Nhi: Cầu Nguyện, Rước Lễ, Hy Sinh và Làm Việc Tông Ðồ cũng như thực hành các tôn chỉ của phong trào TNTT. Em sẽ chu toàn bổn phận của một đoàn sinh trong đoàn TNTT và thực thi đúng các nội quy của đoàn TNTT.</Text>
                {member.mainInfo.participantSignature ? (
                    <Image
                        src={member.mainInfo.participantSignature}
                        style={{ width: 150, height: 60, marginBottom: 4 }}
                    />
                ) : (
                    <Text style={styles.field}>[Chưa ký]</Text>
                )}
                <View style={styles.row}>
                    <Text style={styles.label}>Người ký:</Text>
                    <Text style={styles.value}>{member.mainInfo.participantSignatureName || ''}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Ngày ký:</Text>
                    <Text style={styles.value}>{member.submissionDate || new Date().toLocaleDateString()}</Text>
                </View>
            </View>

            {/* Parent signature if under 18 */}
            {calculateAge(member.dob) < 18 && (
                <View style={styles.section}>
                    <Text style={styles.waiverAgreement}>Tôi cho phép con tôi sinh hoạt <Text style={{ backgroundColor: "yellow" }}>Đoàn TNTT-Mẹ Thiên Chúa, Riverside</Text>. Tôi sẽ hoàn toàn chịu trách nhiệm nếu có những trường hợp không may xảy ra với con tôi trong các giờ sinh hoạt của đoàn.</Text>
                    {member.mainInfo.parentSignature ? (
                        <Image
                            src={member.mainInfo.parentSignature}
                            style={{ width: 150, height: 60, marginBottom: 4 }}
                        />
                    ) : (
                        <Text style={styles.field}>[Chưa ký phụ huynh]</Text>
                    )}
                    <View style={styles.row}>
                        <Text style={styles.label}>Người ký:</Text>
                        <Text style={styles.value}>{member.mainInfo.parentSignatureName || ''}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ngày ký:</Text>
                        <Text style={styles.value}>{member.submissionDate || new Date().toLocaleDateString()}</Text>
                    </View>
                </View>
            )}
        </View>

        {member.paymentInfo && !isCamp && (
            <View style={styles.section}>
                <Text style={styles.subsectionTitle}>THÔNG TIN THANH TOÁN (Tổng cộng:  ${calculateTotal(member.paymentInfo, member.isAdult)}.00)</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Niên liễm:</Text>
                    <Text style={styles.value}>$50.00</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Áo uniform:</Text>
                    <Text style={styles.value}>
                        {member.paymentInfo.uniformShirt ? 'Có ($25.00)' : 'Không'}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Skort uniform:</Text>
                    <Text style={styles.value}>
                        {member.paymentInfo.uniformSkort ? 'Có ($25.00)' : 'Không'}
                    </Text>
                </View>
                {!member.isAdult && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Khăn:</Text>
                        <Text style={styles.value}>
                            {member.paymentInfo.scarf ? 'Có ($10.00)' : 'Không'}
                        </Text>
                    </View>
                )}
            </View>
        )}
    </Page>
);

// Trang 2: Health Info (Tiếng Anh)
const Page2HealthInfo = ({ member }) => (
    <Page size="A4" style={styles.page}>
        <PDFHeader />
        <Text style={styles.sectionTitle}>HEALTH INFORMATION</Text>

        <View style={styles.section}>
            <Text style={styles.subsectionTitle}>PERSONAL INFORMATION</Text>
            <View style={styles.row}>
                <Text style={styles.label}>LAST NAME: </Text>
                <Text style={styles.value}>{member.mainInfo.lastName || ''}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>FIRST NAME: </Text>
                <Text style={styles.value}>{member.mainInfo.givenName || ''}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>ADDRESS: </Text>
                <Text style={styles.value}>{`${member.mainInfo.streetAddress || ''}, ${member.mainInfo.city || ''}, ${member.mainInfo.state || ''} ${member.mainInfo.zip || ''}`}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>PHONE NUMBER:</Text>
                <Text style={styles.value}>{member.mainInfo?.cellPhone || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>EMAIL:</Text>
                <Text style={styles.value}>{member.mainInfo?.email || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>BIRTHDAY:</Text>
                <Text style={styles.value}>{member.dob || 'N/A'} {calculateAge(member.dob) < 18 && "(MINOR)"}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>GENDER:</Text>
                <Text style={styles.value}>{member.healthInfo.gender.toUpperCase()}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>PARISH:</Text>
                <Text style={styles.value}>Our Lady of Perpetual Help Church, Riverside, CA</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>DIOCESE:</Text>
                <Text style={styles.value}>San Bernadino, CA</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.subsectionTitle}>MEDICAL INFORMATION</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Doctor's Name:</Text>
                <Text style={styles.value}>{member.healthInfo?.doctor || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Doctor's Phone:</Text>
                <Text style={styles.value}>{member.healthInfo?.doctorPhone || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Insurance Company:</Text>
                <Text style={styles.value}>{member.healthInfo?.insuranceCo || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Insurance ID:</Text>
                <Text style={styles.value}>{member.healthInfo?.insuranceId || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Group Number:</Text>
                <Text style={styles.value}>{member.healthInfo?.insuranceGroup || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Cardholder Name:</Text>
                <Text style={styles.value}>{member.healthInfo?.insuranceCardholder || 'N/A'}</Text>
            </View>
            <View style={styles.waiverSection}>
                <Text style={styles.label}>PARTICIPANT'S ALLERGIES (including meds and food):</Text>
                <Text style={styles.value}>{member.healthInfo?.allergies || 'None reported'}</Text>
            </View>
            <View style={styles.waiverSection}>
                <Text style={styles.label}>CHRONIC MEDICAL CONCERNS (e.g. diabetes, or any mental behavior and health issues, including drug use):</Text>
                <Text style={styles.value}>{member.healthInfo?.chronicConcerns || 'None reported'}</Text>
            </View>
            <View style={styles.waiverSection}>
                <Text style={styles.label}>OTHER PHYSICAL RESTRICTIONS:</Text>
                <Text style={styles.value}>{member.healthInfo?.physicalRestrictions || 'None reported'}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.subsectionTitle}>EMERGENCY CONTACT</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Name - Relationship:</Text>
                <Text style={styles.value}>{member.healthInfo?.emergencyContact?.name || 'N/A'} - {member.healthInfo?.emergencyContact?.relationship || 'N/A'}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{member.healthInfo?.emergencyContact?.phone || 'N/A'}</Text>
            </View>
        </View>
    </Page>
);

const initialSign = ({ member }) => {
    const initials = (member.mainInfo?.givenName?.[0] || '') + (member.mainInfo?.lastName?.[0] || '');
    return (
        <Text style={{ fontStyle: 'italic' }}>
            _{initials}_ (please initial for concurrence)
        </Text>
    );
};

// Trang 3-4: Waiver Release (Tiếng Anh)
const Page3Waiver = ({ member }) => (
    <Page size="A4" style={styles.page}>
        <PDFHeader />
        <Text style={styles.sectionTitle}>WAIVER AND RELEASE OF LIABILITY</Text>

        <View style={styles.waiverSection}>
            <Text style={styles.waiverText}>
                I, <Text style={{ fontWeight: "bold" }}>{member.mainInfo?.givenName} {member.mainInfo?.lastName}</Text>, an adult [age of majority, per State (e.g., 18 years old in California)] and I am the named participant, or I am the parent/guardian of the minor who will be participating in the above-mentioned event ("The Event") organized and/or sponsored by the Vietnamese Eucharistic Youth Movement in the U.S.A. ("VEYM"). <Text style={{ textDecoration: "underline" }}>I am fully aware that my or my child's participation in The Event is totally voluntary</Text>. Meanwhile, I or my child shall comply with all applicable Codes of Conduct, and generally conduct myself/himself/herself/themselves at all times in keeping with the highest moral and ethical standards, and abide by all applicable rules of law, so as to reflect positively on myself/himself/herself/themselves, the Event, and Catholic teachings. If I or my child violate these obligations which result in bodily injury or property damage during the Event, I or my child who violated these obligations will solely pay to restore or replace any property damaged as a result of the violation, pay any damages caused to bodily injury to an individual, and defend, protect and hold VEYM, its executive members, youth leaders, and volunteers, the local diocese, priests or other religious or clergy members, harmless, from such bodily injury or property damage claims.
            </Text>
            <Text style={styles.waiverText}>
                I am aware that The Event may involve the following activities but not limited to: running, jumping, sharing personal stories, singing, clapping, shouting, sitting for prolonged periods of time, early wake-up, sleeping in cabins, sleeping in tents, use of low-light restrooms, outdoor activities in dirt, uneven, dusty and rocky terrain, sleeping outdoors, activities relating to outdoor environment, aquatic activities, and supervised online group activities utilizing tools that include, but are not limited to Google Meets, Microsoft Teams, and Zoom, pursuant to Children's Online Privacy Protection Act of 1998, (15 U.S.C. 6501, et seq.,). All activities will be monitored by at least 2 adults. In consideration of the agreement, by the youth leaders and/or executive committee of the local chapter, to permit me or my child to participate in The Event, the receipt and sufficiency in which consideration is hereby acknowledged, I, <Text style={{ fontWeight: "bold" }}>{member.mainInfo?.givenName} {member.mainInfo?.lastName}</Text>, agree as follows.
            </Text>
            <Text style={styles.waiverText}>
                1. Release, acquit and forever discharge VEYM and their employees, volunteers, agents, servants, officers, trustees, representatives, affiliates, and sponsors, in their official and individual capacities, as well as my Parish and my Diocese, their employees and agents, representatives, sponsors, chaperones, or volunteers, from any and all liability whatsoever for any and all damages, injuries (including death) to persons, loss to property, or both, which arise during, out of, or in connection with my participation in The Event, which may be sustained or suffered by me, my child or any person in connection with any activities of The Event, including, but not limited to, those related activities directly or indirectly leading up to and stemming from The Event, even those activities which arise out of my travel to and from The Event; {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                2. Agree to indemnify (compensate for harm or loss), defend and hold harmless VEYM and their employees, volunteers, agents, servants, officers, trustees, representatives, affiliates, and sponsors, in their official and individual capacities, as well as my Parish and my Diocese, their employees and agents, representatives, sponsors, chaperones, or volunteers, against all claims, including, but not limited to, claims of negligence, unintentional acts, and acts of omission, and from any and all liability, loss or damage they sustain as a result of any claims, demands, actions, causes of action, judgments, costs or expenses they incur, including attorney's fees, which result from or arise out of my or my child's participation in The Event, including but not limited to, my travel to and from The Event. {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                3. There are certain inherent dangers and foreseeable and unforeseeable risks of harm to myself, my child and others arising from The Event's various activities, including but not limited to, sustaining bodily or emotional injury, that could result from my participation in The Event. Injuries might arise from my actions or inactions, the actions or inactions of another participant in activities, or the actual or alleged failure by any youth leaders, agents or volunteers to adequately coach, train, instruct, or supervise activities. I have knowingly and voluntarily decided to assume the risks of these inherent dangers in consideration of the permission, by the youth leaders and/or executive committee of the local chapter, to allow me or my child to participate in The Event; I hereby acknowledge that I am aware of the risks, dangers and hazards associated with my participation in The Event, and I voluntarily assume all such risks, dangers and hazards, including but not limited to those described above, and the possibility of personal injury, death, property damage or loss resulting therefrom. {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                4. Whether or not there is an endemic, epidemic, or pandemic, communicable diseases (such as, for examples, the common flu or the coronavirus) may be carried by any persons on campus. The carriers may be unknown or not be identified by VEYM, its directors and officers, executive committee members, youth leaders, and volunteers. When in-person meetings on campus are permitted by my diocese under guidelines of governmental and local health agencies, there is an inherent risk that my child's or my participation may put me at risk of exposure, and I assume all foreseeable and unforeseeable risks of harm I or my child may be exposed to therefrom; {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                5. Weather conditions, including Acts of God, or natural causes (which humans do not intervene to cause), may alter or affect plans, expenses, and activities relating to, and including, The Event, and I understand that inherent dangers and risks of harm to myself, my child and others as a result of such natural causes may vary, and I assume all foreseeable and unforeseeable risks of harm I or my child may be exposed to therefrom; {initialSign({ member })}
            </Text>
        </View>
    </Page>
);

const Page4Waiver = ({ member }) => (
    <Page size="A4" style={styles.page}>
        <PDFHeader />
        <View style={styles.waiverSection}>
            <Text style={styles.waiverText}>
                6. My or my child's personal property may be at my risk of theft, damage, or loss entirely; {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                7. VEYM reserves the right to decline, to accept, or retain me or my child in The Event at any time should my actions or general behavior impede the operation of The Event or the rights or welfare of any other person. <Text style={{ textDecoration: "underline" }}>I understand that I or my child may be required to leave The Event in the sole discretion the organizers, agents, and representatives</Text>. If I am or my child is required to leave, no refund will be given to me or my child for any unused portion of The Event, and the local chapter will not reimburse me for any alleged direct or indirect costs or expenses I or my child incurred as a result of my or my child's participation in The Event. {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                8. I understand that VEYM, in its sole discretion, reserves the right to cancel The Event or any aspect thereof prior to commencement. In the event of cancellation of The Event in whole or in part, I accept that I or my child may not be reimbursed or refunded for any unused portion of The Event. {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                o I represent and warrant that I am or my child is covered throughout The Event by a policy of comprehensive health and accident insurance which provides coverage for injuries which I or my child may sustain as part of my or my child's participation in The Event. Even if I am or my child is not covered by any health insurance during The Event, however, I agree to complete the HEALTH INFORMATION section to the best of my ability and, by its completion, I hereby release and discharge VEYM of all responsibility and liability for any injuries, illnesses, medical bills, charges or similar expenses I may incur while participating in The Event. By completing the form, I hereby authorize VEYM to obtain any necessary medical treatment to myself or my child, consent to any necessary examination, treatment, or care under the supervision and/or advice of any properly licensed medical professional, and I explicitly authorize VEYM to release medical information about me or my child to any person or entity to whom VEYM refers me for medical treatment. {initialSign({ member })}
            </Text>
            <Text style={styles.waiverText}>
                o I agree that this agreement is to be construed pursuant to the laws of the State of California and is intended to be as broad and inclusive as permitted by law, and if any portion hereof is held invalid, it is agreed that the balance hereof shall continue in full legal force and effect. In addition, I agree that any legal action arising out of or in relation to this agreement must be brought in Riverside County, California State court.
            </Text>
            <Text style={styles.waiverText}>
                o To the extent that statute or case law does not prohibit releases for negligence, this release is also for negligence.
            </Text>
            <Text style={styles.waiverText}>
                o I hereby grant VEYM my consent without reservation to use, assign, convey, reproduce, copyright, publish or sell my name, voice, image, and/or likeness that arise from my participation in The Event, whether still or motion pictures, audio or video tape, for promotional, instructional, business or any other lawful purposes, at VEYM's sole discretion, should any such name, voice, image, and/or likeness be shared with VEYM by the local chapter.
            </Text>
            <Text style={styles.waiverAgreement}>
                IN SIGNING THIS AGREEMENT, I HEREBY ACKNOWLEDGE AND REPRESENT THAT I HAVE READ THIS ENTIRE DOCUMENT, THAT I UNDERSTAND ITS TERMS AND PROVISIONS, THAT I UNDERSTAND IT AFFECTS MY LEGAL RIGHTS, THAT IT IS A BINDING AGREEMENT, AND THAT I HAVE SIGNED IT KNOWINGLY AND VOLUNTARILY. I AM AWARE THAT THIS IS A RELEASE OF LIABILITY AND A CONTRACT AND I SIGN IT OF MY OWN FREE WILL.
            </Text>
            <Text style={styles.waiverAgreement}>
                BY SIGNING THIS RELEASE, I ALSO ACKNOWLEDGE THAT I UNDERSTAND ITS CONTENT AND THAT THIS RELEASE CANNOT BE MODIFIED ORALLY.
            </Text>
        </View>
        <Image
            src={member.waiverRelease.signature}
            style={{ width: 150, height: 60, marginBottom: 4 }}
        />
        <View style={styles.row}>
            <Text style={styles.label}>Người ký:</Text>
            <Text style={styles.value}>{member.waiverRelease.signatureName || ''}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Ngày ký:</Text>
            <Text style={styles.value}>{member.submissionDate || new Date().toLocaleDateString()}</Text>
        </View>
    </Page>
);

// Trang 5: TNTT Rules (Tiếng Anh)
const Page5TNTTRules = ({ member }) => (
    <Page size="A4" style={styles.page}>
        <PDFHeader />
        <Text style={styles.sectionTitle}>ĐOÀN THIẾU NHI THÁNH THỂ's RULES</Text>

        <View style={styles.rulesList}>
            <Text style={styles.ruleItem}>1. Obey the authority and follow the instructions of your nganh’s youth leaders, squad leader and chaplain. Show respect and be polite toward all those older than you since they replace the role of your parents when you are not at home. Take care of and sacrifice for those younger than you since they are your younger brothers and sisters through Christ.</Text>
            <Text style={styles.ruleItem}>2. Make words such as: “please”, “thank you”, “may I help?”, “you are welcome”, “yes”, “no”, “I don’t understand” and “I’m sorry” part of your regular speech. “Thưa”, “dạ”, “có” and “vâng” are even better. Do not use words such as: “huh?”, “yeah”, “uh huh”, “OK”, “whatever”, “sure” and “hmmmmm?”. No inappropriate body sounds during any activities, especially Mass (e.g., burping, yelling, yawning, flatulating, clicking tongue, humming to self).</Text>
            <Text style={styles.ruleItem}>3. Be on time, have good attendance, participate in all activities created by the VEYM Leadership Team and all church/community’s activities requested by the Community Leadership Team, and demonstrate and exemplify a good model of Christian character for those younger than you by living out the Gifts of the Holy Spirit and the spiritual and corporeal works of mercy.</Text>
            <Text style={styles.ruleItem}>4. Wear VEYM uniform approved by VEYM Leadership Team: white VEYM logo dress shirt, blue pants/shorts/skirt, scarf for your nganh, and comfortable running shoes. All parts of appropriate uniform must be clean and properly on at all times during Vietnamese Language, Catechism, VEYM and Mass times. Slovenly appearance is not acceptable.</Text>
            <Text style={styles.ruleItem}>5. Do not bring any kind of weapon onto church property, e.g., knives, guns, lighters. Do not bring illegal items onto church property either, e.g., drugs, un-Christian magazines, playing cards.</Text>
            <Text style={styles.ruleItem}>6. Keep your hands and feet to yourself: take care of church and VEYM property and respect the personal boundaries of others.</Text>
            <Text style={styles.ruleItem}>7. Avoid non-VEYM goals, e.g., storage/philios/eros love relationships, social cliques, truancy to go to mall/movies/shopping/“friend’s home”.</Text>
            <Text style={styles.ruleItem}>8. No gossiping (i.e., discussing nonfactual personal information about others without them being there), no fighting/harassing/teasing, no arguing (i.e., interrupting each other, raising voices, mocking behavior, pointing), no cursing/swearing/blasphemy will be allowed during VEYM time.</Text>
            <Text style={styles.ruleItem}>9. One-on-one contact between adults (youth leader) and youth prohibited. One-on-one contact between adults and youth members is not permitted. In situations that require personal conferences, such as a leader conference, the meeting is to be conducted in view of other adults and youths.</Text>
            <Text style={styles.ruleItem}>10.No hazing. Physical hazing and initiations are prohibited and may not be included as part of any VEYM activity. Verbal, physical, and cyberbullying are also prohibited.</Text>
        </View>

        <View style={styles.waiverSection}>
            <Text style={styles.waiverTitle}>CONSEQUENCES OF BREAKING 1 OF THE 10 RULES ABOVE</Text>
            <Text style={styles.ruleItem}>1. The responsible youth leader, i.e., Squad Leader or Nganh Leader will give private warning/advice.</Text>
            <Text style={styles.ruleItem}>2. The Squad Leader and the Leadership Team will warn in the Youth Leaders' Council meeting if he/she is a youth leader, the Nganh Leader will warn in the nganh if he/she is a youth member.</Text>
            <Text style={styles.ruleItem}>3. The priest will talk with the entire VEYM about the wrongdoer and expel him/her out of the Eucharistic Youth.</Text>
        </View>

        <View style={styles.waiverSection}>
            <Text style={styles.waiverAgreement}>
                I understand and agree to follow the above rules. I will respect and love God, myself, and others.
            </Text>
            <Image
                src={member.tnttRules?.signature}
                style={{ width: 150, height: 60, marginBottom: 4 }}
            />
            <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{member.tnttRules?.signatureName || ''}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{member.submissionDate || new Date().toLocaleDateString()}</Text>
            </View>
        </View>
    </Page>
);

// Main PDF Document với 5 trang
const MemberPDFDocument = ({ member, isCamp = false }) => (
    <Document>
        <Page1MainInfo member={member} isCamp={isCamp} />
        <Page2HealthInfo member={member} />
        <Page3Waiver member={member} />
        <Page4Waiver member={member} />
        {!isCamp && (<Page5TNTTRules member={member} />)}
    </Document>
);

// Helper function để tính tổng
const calculateTotal = (paymentInfo, isAdult) => {
    if (!paymentInfo) return 0;
    let total = paymentInfo.annualFee || 0;
    if (paymentInfo.uniformShirt) total += 25;
    if (paymentInfo.uniformSkort) total += 25;
    if (!isAdult && paymentInfo.scarf) total += 10;
    return total;
};

// Main PDF Generator Component
const PDFGenerator = ({ data, type = 'member' }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const blob = await pdf((
                <MemberPDFDocument
                    member={data}
                    isCamp={type === 'camp'}
                />
            )).toBlob();

            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (error) {
            console.error('Lỗi khi tạo PDF:', error);
            alert('Có lỗi xảy ra khi tạo PDF!');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPDF = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${type === 'camp' ? 'camp-registration' : 'member-registration'}-${data.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const closePreview = () => {
        setPdfUrl(null);
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    };

    return (
        <div className="pdf-generator">
            <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="pdf-btn"
            >
                {isGenerating ? 'Đang tạo PDF...' : 'Xem PDF'}
            </button>

            {pdfUrl && (
                <div className="pdf-preview-overlay">
                    <div className="pdf-preview-modal">
                        <div className="pdf-preview-header">
                            <h3>Xem trước PDF</h3>
                            <button onClick={closePreview} className="close-btn">
                                ✕
                            </button>
                        </div>

                        <div className="pdf-preview-content">
                            <iframe
                                src={pdfUrl}
                                title="PDF Preview"
                                width="100%"
                                height="500"
                                style={{ border: 'none' }}
                            />
                        </div>

                        <div className="pdf-preview-actions">
                            <button onClick={downloadPDF} className="download-btn">
                                📥 Tải xuống PDF
                            </button>
                            <button onClick={closePreview} className="cancel-btn">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PDFGenerator;