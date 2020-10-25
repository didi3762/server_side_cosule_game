class CustomerModel
{
	constructor(first_name, password, pothUrl, sudoko_score, trivya_score,currenr_score,sum_score)
	{
		this.first_name = first_name;
		this.trivya_score = trivya_score;
		this.sudoko_score = sudoko_score;
		this.currenr_score = currenr_score;
		this.sum_score = sum_score;
		this.pothUrl = pothUrl;
		this.password = password;
	}
}

module.exports = CustomerModel;