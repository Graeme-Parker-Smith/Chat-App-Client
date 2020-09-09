import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { Text, Button, Input, CheckBox } from 'react-native-elements';
import FadeInView from '../components/FadeInView';
import BouncyInput from '../components/BouncyInput';
import WhiteText from '../components/WhiteText';
import AvatarPicker from '../components/AvatarPicker';
import Spacer from './Spacer';

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText, isSignup = false }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [avatar, setAvatar] = useState('');
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const _usernameInput = useRef();
	const _passwordInput = useRef();

	const _next = () => {
		_passwordInput && _passwordInput.current.focus();
	};

	return (
		<SafeAreaView forceInset={{ top: 'always' }} style={styles.container}>
			<Spacer />
			<Spacer>
				<FadeInView>
					<WhiteText fontSize={40} style={{ color: 'white', alignSelf: 'center' }} h3>
						{headerText}
					</WhiteText>
				</FadeInView>
			</Spacer>
			<BouncyInput
				placeholder={'username'}
				value={username}
				onChangeText={setUsername}
				autoFocus={false}
				autoCapitalize="none"
				maxLength={30}
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				onSubmitEditing={_next}
			/>
			<Spacer />
			<BouncyInput
				placeholder={'password'}
				secure={true}
				value={password}
				onChangeText={setPassword}
				autoCapitalize="none"
				maxLength={22}
				autoCorrect={false}
				containerStyle={styles.input}
				inputStyle={{ color: 'white' }}
				returnKeyType="next"
				selectTextOnFocus={true}
				ref={_passwordInput}
				onSubmitEditing={isSignup ? null : () => onSubmit({ username, password })}
			/>
			<Spacer />
			{isSignup ? (
				<View>
					<AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={'User'} displayName={username} />
					<ScrollView style={{ height: 200, borderColor: '#808080', borderWidth: 1 }}>
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
							End-User License Agreement (EULA)
						</Text>
						<Text style={{ color: '#fff' }}>
							This End-User License Agreement ("EULA") is a legal agreement between you and Jaded. This
							EULA agreement governs your acquisition and use of our Jaded software ("Software") directly
							from Jaded or indirectly through a Jaded authorized reseller or distributor (a "Reseller").
							Our Privacy Policy was created by the Privacy Policy Generator. Please read this EULA
							agreement carefully before completing the installation process and using the Jaded software.
							It provides a license to use the Jaded software and contains warranty information and
							liability disclaimers. By clicking "accept" or installing and/or using the Jaded software,
							you are confirming your acceptance of the Software and agreeing to become bound by the terms
							of this EULA agreement. If you are entering into this EULA agreement on behalf of a company
							or other legal entity, you represent that you have the authority to bind such entity and its
							affiliates to these terms and conditions. If you do not have such authority or if you do not
							agree with the terms and conditions of this EULA agreement, do not install or use the
							Software, and you must not accept this EULA agreement. This EULA agreement shall apply only
							to the Software supplied by Jaded herewith regardless of whether other software is referred
							to or described herein. The terms also apply to any Jaded updates, supplements,
							Internet-based services, and support services for the Software, unless other terms accompany
							those items on delivery. If so, those terms apply. License Grant Jaded hereby grants you a
							personal, non-transferable, non-exclusive licence to use the Jaded software on your devices
							in accordance with the terms of this EULA agreement. You are permitted to load the Jaded
							software under your control. You are responsible for ensuring your device meets the minimum
							requirements of the Jaded software. You are not permitted to: Edit, alter, modify, adapt,
							translate or otherwise change the whole or any part of the Software nor permit the whole or
							any part of the Software to be combined with or become incorporated in any other software,
							nor decompile, disassemble or reverse engineer the Software or attempt to do any such things
							Reproduce, copy, distribute, resell or otherwise use the Software for any commercial purpose
							Allow any third party to use the Software on behalf of or for the benefit of any third party
							Use the Software in any way which breaches any applicable local, national or international
							law use the Software for any purpose that Jaded considers is a breach of this EULA agreement
							Intellectual Property and Ownership Jaded shall at all times retain ownership of the
							Software as originally downloaded by you and all subsequent downloads of the Software by
							you. The Software (and the copyright, and other intellectual property rights of whatever
							nature in the Software, including any modifications made thereto) are and shall remain the
							property of Jaded. Jaded reserves the right to grant licences to use the Software to third
							parties. Termination This EULA agreement is effective from the date you first use the
							Software and shall continue until terminated. You may terminate it at any time upon written
							notice to Jaded. It will also terminate immediately if you fail to comply with any term of
							this EULA agreement. Upon such termination, the licenses granted by this EULA agreement will
							immediately terminate and you agree to stop all access and use of the Software. The
							provisions that by their nature continue and survive will survive any termination of this
							EULA agreement. Governing Law This EULA agreement, and any dispute arising out of or in
							connection with this EULA agreement, shall be governed by and construed in accordance with
							the laws of us.
						</Text>
						<Spacer />
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Privacy Policy</Text>
						<Text style={{ color: '#fff' }}>
							Graeme Smith built the Jaded app as a Free app. This SERVICE is provided by Graeme Smith at
							no cost and is intended for use as is. This page is used to inform visitors regarding my
							policies with the collection, use, and disclosure of Personal Information if anyone decided
							to use my Service. If you choose to use my Service, then you agree to the collection and use
							of information in relation to this policy. The Personal Information that I collect is used
							for providing and improving the Service. I will not use or share your information with
							anyone except as described in this Privacy Policy. The terms used in this Privacy Policy
							have the same meanings as in our Terms Of Use, which is accessible at Jaded unless otherwise
							defined in this Privacy Policy.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
							Information Collection and Use
						</Text>
						<Text style={{ color: '#fff' }}>
							For a better experience, while using our Service, I may require you to provide us with
							certain personally identifiable information, including but not limited to No Information.
							The information that I request will be retained on your device and is not collected by me in
							any way.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Log Data</Text>
						<Text style={{ color: '#fff' }}>
							I want to inform you that whenever you use my Service, in a case of an error in the app I
							collect data and information (through third party products) on your phone called Log Data.
							This Log Data may include information such as your device Internet Protocol (“IP”) address,
							device name, operating system version, the configuration of the app when utilizing my
							Service, the time and date of your use of the Service, and other statistics.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Cookies</Text>
						<Text style={{ color: '#fff' }}>
							Cookies are files with a small amount of data that are commonly used as anonymous unique
							identifiers. These are sent to your browser from the websites that you visit and are stored
							on your device's internal memory. This Service does not use these “cookies” explicitly.
							However, the app may use third party code and libraries that use “cookies” to collect
							information and improve their services. You have the option to either accept or refuse these
							cookies and know when a cookie is being sent to your device. If you choose to refuse our
							cookies, you may not be able to use some portions of this Service.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Service Providers</Text>
						<Text style={{ color: '#fff' }}>
							I may employ third-party companies and individuals due to the following reasons: To
							facilitate our Service; To provide the Service on our behalf; To perform Service-related
							services; or To assist us in analyzing how our Service is used. I want to inform users of
							this Service that these third parties have access to your Personal Information. The reason
							is to perform the tasks assigned to them on our behalf. However, they are obligated not to
							disclose or use the information for any other purpose.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Security</Text>
						<Text style={{ color: '#fff' }}>
							I value your trust in providing us your Personal Information, thus we are striving to use
							commercially acceptable means of protecting it. But remember that no method of transmission
							over the internet, or method of electronic storage is 100% secure and reliable, and I cannot
							guarantee its absolute security.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Links To Other Sites</Text>
						<Text style={{ color: '#fff' }}>
							This Service may contain links to other sites. If you click on a third-party link, you will
							be directed to that site. Note that these external sites are not operated by me. Therefore,
							I strongly advise you to review the Privacy Policy of these websites. I have no control over
							and assume no responsibility for the content, privacy policies, or practices of any
							third-party sites or services.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Children's Privacy</Text>
						<Text style={{ color: '#fff' }}>
							These Services do not address anyone under the age of 13. I do not knowingly collect
							personally identifiable information from children under 13. In the case I discover that a
							child under 13 has provided me with personal information, I immediately delete this from our
							servers. If you are a parent or guardian and you are aware that your child has provided us
							with personal information, please contact me so that I will be able to do necessary actions.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
							Changes to This Privacy Policy
						</Text>
						<Text style={{ color: '#fff' }}>
							I may update our Privacy Policy from time to time. Thus, you are advised to review this page
							periodically for any changes. I will notify you of any changes by posting the new Privacy
							Policy on this page. This policy is effective as of 2020-09-07
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Contact Us</Text>
						<Text style={{ color: '#fff' }}>
							If you have any questions or suggestions about my Privacy Policy, do not hesitate to contact
							me at jadedreports@gmail.com. This privacy policy page was created at
							privacypolicytemplate.net and modified/generated by App Privacy Policy Generator
						</Text>
						<Spacer />
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Terms Of Use</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
							Respecting Other's Rights
						</Text>

						<Text style={{ color: '#fff' }}>
							We respect the rights of others and we expect the same from you. You therefore may not use
							the Services, or enable anyone else to use the Services, in a manner that: Violates or
							infringes someone else’s rights of publicity, privacy, copyright, trademark, or other
							intellectual-property right Bullies, harasses, or intimidates Defames Spams or solicits our
							users
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Age Requirements</Text>
						<Text style={{ color: 'white' }}>
							This app is not intended for use by anyone under the age of 18. By creating an account, you
							certify that you are at least 18 years of age.
						</Text>
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Safety</Text>
						<Text style={{ color: '#fff' }}>
							We try hard to keep our Services a safe place for all users and we hope you can help us in
							achieving this. By using the Services, you agree that you will not:
						</Text>
						<Text style={{ color: '#fff' }}>
							Use the Services for any purpose that is illegal or prohibited in these Terms
						</Text>
						<Text style={{ color: '#fff' }}>
							Use any robot, spider, crawler, scraper, or other automated means or interface to access the
							Services or extract other user’s information
						</Text>
						<Text style={{ color: '#fff' }}>
							Use or develop any third-party applications that interact with the Services or other users’
							content or information without our written consent
						</Text>
						<Text style={{ color: '#fff' }}>
							Use the Services in a way that could interfere with, disrupt, negatively affect, or inhibit
							other users from fully enjoying the Services, or that could damage, disable, overburden, or
							impair the functioning of the Services
						</Text>
						<Text style={{ color: '#fff' }}>
							Use or attempt to use another user’s account, username, or password without their permission
						</Text>
						<Text style={{ color: '#fff' }}>Solicit login credentials from another user</Text>
						<Text style={{ color: '#fff' }}>
							Post content that contains or links to ***********, graphic violence, threats, hate speech,
							or incitements to violence
						</Text>
						<Text style={{ color: '#fff' }}>
							Upload viruses or other malicious code or otherwise compromise the security of the Services.
						</Text>
						<Text style={{ color: '#fff' }}>
							Attempt to circumvent any content-filtering techniques we employ, or attempt to access areas
							or features of the Services that you are not authorized to access.
						</Text>
						<Text style={{ color: '#fff' }}>
							Probe, scan, or test the vulnerability of our Services or any system or network.
						</Text>
						<Text style={{ color: '#fff' }}>
							Encourage or promote any activity that violates these Terms
						</Text>
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
							Any user accounts that are found to be in violation of these Terms of Service may be subject
							to a permanent ban or suspension.
						</Text>
						<Spacer margin={15} />
						<CheckBox
							checked={agreedToTerms}
							containerStyle={{ margin: 15, padding: 15 }}
							onPress={() => setAgreedToTerms(!agreedToTerms)}
							title="By checking this box and signing up, I certify that I am at least 18 years of age, and that I have read and agree to the Privacy Policy, End User License Agreement, and Terms of Use"
						/>
					</ScrollView>
					<Button
						disabled={!username || !password || !agreedToTerms}
						title={submitButtonText}
						onPress={() =>
							onSubmit({ username, password, avatar: avatar.base64Uri ? avatar.base64Uri : null })
						}
					/>
				</View>
			) : (
				<Button
					disabled={!username || !password}
					title={submitButtonText}
					onPress={() => onSubmit({ username, password, avatar: avatar.base64Uri ? avatar.base64Uri : null })}
				/>
			)}
			{errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
			{/* <Spacer /> */}
			{/* <Button
				disabled={!username || !password}
				title={submitButtonText}
				onPress={() => onSubmit({ username, password, avatar: avatar.base64Uri ? avatar.base64Uri : null })}
			/> */}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		// height: Dimensions.get('window').height,
		// backgroundColor: '#000',
		// color: 'white',
	},
	errorMessage: {
		fontSize: 16,
		color: 'red',
		marginLeft: 15,
		marginTop: 15,
	},
	input: {
		width: '75%',
		alignSelf: 'center',
	},
});

export default AuthForm;
