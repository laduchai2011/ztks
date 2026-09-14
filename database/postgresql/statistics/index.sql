CREATE TABLE statistics_oa (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	sales DECIMAL(20,2) NOT NULL, 
	order_amount INT NOT NULL,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	zalo_oa_id UUID NOT NULL,
	of_day DATE NOT NULL,
   	create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT ux_statistics_oa_zalo_oa_id_of_day UNIQUE (zalo_oa_id, of_day),
	CONSTRAINT FK_statistics_oa_zalo_oa_id FOREIGN KEY (zalo_oa_id) REFERENCES zalo_oa(id)
);

CREATE TABLE statistics_member_in_one_month (
	id UUID PRIMARY KEY DEFAULT uuidv7(),
	sales DECIMAL(20,2) NOT NULL, 
	order_amount INT NOT NULL,
	flag VARCHAR(255) NOT NULL,
	is_delete BOOLEAN NOT NULL DEFAULT FALSE,
	of_month DATE NOT NULL,
	zalo_oa_id UUID NOT NULL,
	account_id UUID NOT NULL,
    create_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT check_flag_statistics_member_in_one_day CHECK (flag IN ('old', 'new')),
	CONSTRAINT FK_statistics_member_in_one_month_zalo_oa_id FOREIGN KEY (zalo_oa_id) REFERENCES zalo_oa(id)
);
CREATE INDEX idx_statistics_member_in_one_month_zalo_oa_id_of_month_sales ON statistics_member_in_one_month(zalo_oa_id, of_month, sales);
CREATE UNIQUE INDEX ux_statistics_member_in_one_month_account_id_flag_new ON statistics_member_in_one_month(account_id, flag) WHERE flag = 'new';
CREATE INDEX idx_statistics_member_in_one_month_account_id ON statistics_member_in_one_month(account_id);