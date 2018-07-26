console.log('Javascript is linked');

$('#newUserButton').prop('disabled', true)
$('#newUserButton').css('cursor', 'not-allowed')



//add event listener for when use clicks out of the input form
//checks if both password fields are the same in order to enable submit button
$('input').on('keyup', (event) => {
	$password1 = $('#pass');
	$password2 = $('#checkpass');
	// console.log(typeof $password1.val());
	// console.log($password1.val() == '')
	// //console.log($password2.val());	

	if(($password1.val() !== $password2.val()) || $password1.val() == '' || $password2.val() == '') {
		$('#newUserButton').prop('disabled', true)
		$('#newUserButton').css('cursor', 'not-allowed')
	} else {
		$('#newUserButton').prop('disabled', false)
		$('#newUserButton').css('cursor', 'pointer')
	}

})

// when new user button is clicked
// preventDefault
// get date.now
// get timezone from date.now
// update value of tz field
// event.target.parentNode.submit()


$('#newUserButton').on('click', (event) => {
	event.preventDefault();
	const today = new Date();
	const timezoneOffset = today.getTimezoneOffset();
	$('#timezone').val(timezoneOffset);
	$('#register').submit();
})