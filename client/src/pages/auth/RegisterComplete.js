import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({ history }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	// const { user } = useSelector((state) => ({ ...state }));
	let dispatch = useDispatch();

	useEffect(() => {
		setEmail(window.localStorage.getItem("emailForRegistration"));
	}, [history]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// validation
		if (!email || !password) {
			toast.error("Email and password is required");
			return;
		}

		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("password isn't match");
		}

		try {
			const result = await auth.signInWithEmailLink(
				email,
				window.location.href
			);
			//   console.log("RESULT", result);
			if (result.user.emailVerified && password === confirmPassword) {
				// remove user email fom local storage
				window.localStorage.removeItem("emailForRegistration");
				// get user id token
				let user = auth.currentUser;
				await user.updatePassword(password);
				const idTokenResult = await user.getIdTokenResult();
				// redux store
				createOrUpdateUser(idTokenResult.token)
					.then((res) => {
						console.log(res);
						dispatch({
							type: "LOGGED_IN_USER",
							payload: {
								name: res.data.name,
								email: res.data.email,
								token: idTokenResult.token,
								isAdmin: res.data.isAdmin,
								_id: res.data._id,
							},
						});
					})
					.catch((err) => console.log(err));

				// redirect
				history.push("/");
			}
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const completeRegistrationForm = () => (
		<form onSubmit={handleSubmit}>
			<input type="email" className="form-control" value={email} disabled />

			<input
				type="password"
				className="form-control"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				autoFocus
			/>

			<input
				type="password"
				className="form-control"
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder="Confirm Password"
				autoFocus
			/>
			<br />
			<button
				type="submit"
				className="btn btn-raised"
				disabled={password !== confirmPassword}
			>
				Complete Registration
			</button>
		</form>
	);

	return (
		<div className="container p-5">
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h4>Register Complete</h4>
					{completeRegistrationForm()}
				</div>
			</div>
		</div>
	);
};

export default RegisterComplete;
