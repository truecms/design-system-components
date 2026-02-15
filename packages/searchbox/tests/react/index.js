import React from 'react';
import { createRoot } from 'react-dom/client';

import AUsearchbox from './searchbox.js';
import { AUlabel } from '../../../form/src/js/react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

const SearchboxRouteDemo = () => {
	const navigate = useNavigate();

	return (
		<AUsearchbox
			dark
			label="Search"
			btnText="Search"
			id="def-search--click-route"
			btnProps={{ onClick: () => { navigate('/one') } }}
		/>
	);
};

createRoot(document.getElementById('root')).render(
	<div className="au-grid">
		<div className="split-wrapper">
			<div className="split">
				<h2>Standard</h2>
				<AUsearchbox wrapper='div' label="Search" btnText="Search" id="def-search" btnProps={{className: 'hello', type:'submit'}}/>

				<h2>Responsive</h2>
				<AUsearchbox label="Search" responsive btnText="Search" id="resp-search"/>

				<h2>Icon only</h2>
				<AUsearchbox label="Search" btnText="Search" icon id="icon-search"/>

				<h2>Label outside</h2>
				<AUlabel htmlFor="domain-box" text="Enter a domain"/>
				<AUsearchbox btnText="Check availability" id="domain-box" />

				<h2>Button with onclick function</h2>
				<AUsearchbox label="Search" btnText="Search" id="def-search--btn-click" btnProps={{onClick: () => {console.log('hello')}, type: "button", className: 'blah'}}/>
			</div>
			<div className="split split--dark">
			<h2>Standard</h2>
				<AUsearchbox label="Search" btnText="Search" dark id="def-search-dark-dark"/>

				<h2>Responsive</h2>
				<AUsearchbox label="Search" responsive btnText="Search" dark id="resp-search-dark"/>

				<h2>Icon only</h2>
				<AUsearchbox label="Search" btnText="Search" dark icon id="icon-search-dark"/>

				<h2>Label outside</h2>
				<AUlabel htmlFor="dom" dark text="Enter a domain"/>
				<AUsearchbox btnText="Check availability" id="dom" dark />

				<h2>Button with change route</h2>

				<BrowserRouter>
					<Routes>
						<Route path="/" element={ <SearchboxRouteDemo /> } />
						<Route path="/one" element={ <p>Route one</p> } />
						<Route path="/two" element={ <p>Route two</p> } />
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	</div>
);
