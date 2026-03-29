INSERT INTO dbo.zaloApp (label, appId, appName, appSecret, status, accountId, updateTime, createTime)
VALUES ('5k aquarium', '2474292114893114248', '5k aquarium', '7XFkowzBCeRBRGqDhUkL', 'normal', 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

INSERT INTO dbo.zaloOa (label, oaId, oaName, oaSecret, status, zaloAppId, accountId, updateTime, createTime)
VALUES ('5k aquarium (OA)', '2018793888801741529', '5kcacanh', 'iRf70Tagp3qpjVYuYWld', 'normal', 1, 1, SYSDATETIMEOFFSET(), SYSDATETIMEOFFSET());

INSERT INTO dbo.zaloOaToken (refreshToken, zaloOaId)
VALUES ('mpMt8MQr_t76CBGiRBtzTCyzjIbbfwO6aqov1pcvX1hSN8emUA2H08Xth3jCjw4Jb4Zh7cIavoIQQF4XSOZ5VuS4oqbG_iCGh1NuFtoHzZ-W5xGRL_IhDeynlXriyen5oG64LcZ_Y6Z30S5U2_dFNDXwy5HwYE1NW4xjQa6Onp2CHCqARhxWBwXleWHldQehh1_aCmV_x3Bc9k4-6TtMO-nTncmthUjqt57QM7YFzmYrQTmx5eJ-1DjewnSAWwSppLMtTmtJh7tv8UDkAQVrKUvapc4TfUvZsY3WVG_3g22k8wGPQU6g0CuWl5qtmhy1tmM91mZmdnhfTxCn2FkFDDW5i1merAKqmpAf3HBUkbAt0QXB5lV_UD88oauM-VDriYc-S47mYL2S7BTQTFcrQfmRWpEIj7ffPQ__V0', 1)

UPDATE dbo.zaloOaToken WITH (ROWLOCK)
SET refreshToken = 'dFkA5rDyOqAP_eaQMNHXHv3pY1zGRY8BnhcNLmiuEqgR_ODg1pfWIyZCxtDv46TSkCVrMdKuTbFxqTuBRIue1kRwbrncFnvxmSMDOc0I14t8pPLaT0m_IiIDdc5q32fkeOoIJpL66K6BXeLiHNONNykpc4bASXjI-eoNP5PoOK_ecDr2FLvF6FQxrZ1fMruwsj39EbiWTXJE-jfA3dfULho7xGiMPtqAdRhe8rPk1XpRdvuMPsesBFczX7L5EZXLz_cRScGeS2hAsfyyHZO6VSJnk5DQCW5SajkqGmKF34ALYfXq965sMhU5vGKCUGWlkf-d43Hx63E-dQrhF5m7QPw1ip8iTIqybhN5A5bEJ130hjmMIKLqEUBFt3XH37DXmehGL7C1Hd7PtDXlM5TDJlQGsHBuizjiK6PZJm'
WHERE zaloOaId = 4