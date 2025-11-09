<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class TMDSPRO_Price {
	protected static $instance = null;
	public static function get_instance( $new = false ) {
		if ( $new || null === self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}
	/**
	 * @param $price
	 * @param bool $is_sale_price
	 * @param bool $product_id
	 *
	 * @return float|int|mixed|void
	 */
	public static function process_price( $price, $is_sale_price = false, $product_id = false ) {
		if ( ! $price ) {
			return $price;
		}
		$settings        = TMDSPRO_DATA::get_instance();
		$price_default   = $settings->get_params( 'price_default' );
		$price_from      = $settings->get_params( 'price_from' );
		$price_to        = $settings->get_params( 'price_to' );
		$plus_value_type = $settings->get_params( 'plus_value_type' );
		$plus_value      = $settings->get_params( 'plus_value' );
		$plus_sale_value = $settings->get_params( 'plus_sale_value' );
		if ( $product_id ) {
			$product = wc_get_product( $product_id );
			if ( $product ) {
				$custom_rules = $settings->get_params( 'update_product_custom_rules' );
				if ( is_array( $custom_rules ) && !empty( $custom_rules ) ) {
					if ( $product->is_type( 'variation' ) ) {
						$product_id         = $product->get_parent_id();
						$parent             = wc_get_product( $product_id );
						$product_categories = $parent->get_category_ids();
					} else {
						$product_categories = $product->get_category_ids();
					}
					foreach ( $custom_rules as $custom_rule ) {
						if ( $custom_rule['products'] && ! in_array( $product_id, $custom_rule['products'] ) ) {
							continue;
						}
						if ( $custom_rule['excl_products'] && in_array( $product_id, $custom_rule['excl_products'] ) ) {
							continue;
						}
						if ( $custom_rule['categories'] && empty( array_intersect( $custom_rule['categories'], $product_categories ) ) ) {
							continue;
						}
						if ( $custom_rule['excl_categories'] && !empty( array_intersect( $custom_rule['excl_categories'], $product_categories ) ) ) {
							continue;
						}
						$price_from      = $custom_rule['price_from'];
						$price_default   = $custom_rule['price_default'];
						$price_to        = $custom_rule['price_to'];
						$plus_value      = $custom_rule['plus_value'];
						$plus_sale_value = $custom_rule['plus_sale_value'];
						$plus_value_type = $custom_rule['plus_value_type'];
						break;
					}
				}
			}
		}
		$original_price = $price;
		if ( $is_sale_price ) {
			$level_count = count( $price_from );
			if ( $level_count > 0 ) {
				/*adjust price rules */
				if ( ! is_array( $price_to ) || count( $price_to ) !== $level_count ) {
					if ( $level_count > 1 ) {
						$price_to   = array_values( array_slice( $price_from, 1 ) );
						$price_to[] = '';
					} else {
						$price_to = array( '' );
					}
				}
				$match = false;
				for ( $i = 0; $i < $level_count; $i ++ ) {
					if ( $price >= $price_from[ $i ] && ( $price_to[ $i ] === '' || $price <= $price_to[ $i ] ) ) {
						$match = $i;
						break;
					}
				}
				if ( $match !== false ) {
					if ( $plus_sale_value[ $match ] < 0 ) {
						$price = '';
					} else {
						$price = self::calculate_price_base_on_type( $price, $plus_sale_value[ $match ], $plus_value_type[ $match ] );
					}
				} else {
					$plus_sale_value_default = isset( $price_default['plus_sale_value'] ) ? $price_default['plus_sale_value'] : 1;
					if ( $plus_sale_value_default < 0 ) {
						$price = '';
					} else {
						$price = self::calculate_price_base_on_type( $price, $plus_sale_value_default, isset( $price_default['plus_value_type'] ) ? $price_default['plus_value_type'] : 'multiply' );
					}
				}
			}
		} else {
			$level_count = count( $price_from );
			if ( $level_count > 0 ) {
				/*adjust price rules*/
				if ( ! is_array( $price_to ) || count( $price_to ) !== $level_count ) {
					if ( $level_count > 1 ) {
						$price_to   = array_values( array_slice( $price_from, 1 ) );
						$price_to[] = '';
					} else {
						$price_to = array( '' );
					}
				}
				$match = false;
				for ( $i = 0; $i < $level_count; $i ++ ) {
					if ( $price >= $price_from[ $i ] && ( $price_to[ $i ] === '' || $price <= $price_to[ $i ] ) ) {
						$match = $i;
						break;
					}
				}
				if ( $match !== false ) {
					$price = self::calculate_price_base_on_type( $price, $plus_value[ $match ], $plus_value_type[ $match ] );
				} else {
					$price = self::calculate_price_base_on_type( $price, isset( $price_default['plus_value'] ) ? $price_default['plus_value'] : 2, isset( $price_default['plus_value_type'] ) ? $price_default['plus_value_type'] : 'multiply' );
				}
			}
		}

		return apply_filters( 'villatheme_' . TMDSPRO_DATA::$prefix . '_processed_price', is_numeric( $price ) ? round( floatval( $price ), wc_get_price_decimals() ) : $price, $is_sale_price, $original_price );
	}

	/**
	 * @param $price
	 * @param $value
	 * @param $type
	 *
	 * @return float|int
	 */
	protected static function calculate_price_base_on_type( $price, $value, $type ) {
		$match_value = floatval( $value );
		switch ( $type ) {
			case 'fixed':
				$price = $price + $match_value;
				break;
			case 'percent':
				$price = $price * ( 1 + $match_value / 100 );
				break;
			case 'multiply':
				$price = $price * $match_value;
				break;
			default:
				$price = $match_value;
		}

		return $price;
	}

	/**
	 * @param $price
	 *
	 * @return float|int
	 */
	public static function process_exchange_price( $price, $currency, $rate = null ) {
		if ( ! $price ) {
			return $price;
		}
		$price = self::get_price_with_temu_decimals( $price, $currency );

		if ( $rate === null ) {
			$import_currency_rate = TMDSPRO_DATA::get_instance()->get_params( 'import_currency_rate' );
			$rate                 = $import_currency_rate[ $currency ] ?? 0;
		}
		if ( $rate ) {
			$price = floatval( $price ) * floatval( $rate );
		}

		return $price;
	}
	public static function get_temu_decimals() {
		return TMDSPRO_DATA::json_decode( '{"VND":0,"USD":2,"EUR":2,"AUD":2,"BGN":2,"CAD":2,"CZK":2,"DKK":2,"HUF":0,"ISK":0,"JPY":0,"MYR":2,"MXN":2,"NZD":2,"NOK":0,"PLN":2,"KRW":0,"RON":2,"SEK":2,"CHF":2,"TRY":2,"GBP":2}' );
	}
	public static function get_price_with_temu_decimals( $price, $currency ) {
		$decimals = self::get_temu_decimals();
		$decimal  = 2;
		if ( isset( $decimals[ $currency ] ) ) {
			$decimal = intval( $decimals[ $currency ] );
		}
		$check = 0;
		if ( $decimal ) {
			$check = 1;
			for ( $i = 0; $i < $decimal; $i ++ ) {
				$check *= 10;
			}
		}

		return $check ? $price / $check : $price;
	}

	public static function get_exchange_rate_decimals( $currency ) {
		$decimals = TMDSPRO_DATA::get_instance()->get_params( 'exchange_rate_decimals' );
		$decimal  = 3;
		if ( isset( $decimals[ $currency ] ) ) {
			$decimal = intval( $decimals[ $currency ] );
		}

		return $decimal ?: '';
	}
	/**
	 * Supported exchange API
	 *
	 * @return mixed
	 */
	public static function get_supported_exchange_api() {
		return apply_filters( 'villetheme_' . TMDSPRO_DATA::$prefix . '_get_supported_exchange_api',
			array(
				'0'      => esc_html__( 'None', 'tmds-woocommerce-temu-dropshipping' ),
				'google' => esc_html__( 'Google finance', 'tmds-woocommerce-temu-dropshipping' ),
				'yahoo'  => esc_html__( 'Yahoo finance', 'tmds-woocommerce-temu-dropshipping' ),
				'cuex'   => esc_html__( 'Cuex', 'tmds-woocommerce-temu-dropshipping' ),
				'wise'   => esc_html__( 'Wise', 'tmds-woocommerce-temu-dropshipping' ),
				'custom' => esc_html__( 'Custom', 'tmds-woocommerce-temu-dropshipping' ),
			)
		);
	}


	/**
	 * Get exchange rate based on selected API
	 *
	 * @param string $api
	 * @param string $target_currency
	 * @param bool $decimals
	 * @param string $source_currency
	 *
	 * @return bool|int|mixed|void
	 */
	public static function get_exchange_rate( $api = 'google', $original_price = '', &$decimals = false, $other_price = 'USD' ) {
		if ( $decimals === false ) {
			$decimals = self::get_exchange_rate_decimals( $other_price );
		}
		$rate = false;
		if ( ! $original_price ) {
			$original_price = get_option( 'woocommerce_currency' );
		}
		if ( TMDSPRO_DATA::strtolower( $original_price ) === TMDSPRO_DATA::strtolower( $other_price ) ) {
			$rate = 1;
		} else {
			$func = "get_{$api}_exchange_rate";
			if ( method_exists( 'TMDSPRO_Price', $func ) ) {
				$get_rate = self::$func( $original_price, $other_price );
			} else {
				$get_rate = array(
					'status' => 'error',
					'data'   => false,
				);
			}
			if ( $get_rate['status'] === 'success' && $get_rate['data'] ) {
				$rate = $get_rate['data'];
			}
			$check = explode( '-', $rate );
			if ( ! empty( $check[1] ) && $decimals === '' ) {
				$decimals = 30;
			}
			if (!is_numeric($decimals)){
				$decimals = 3;
			}
			$rate = apply_filters( 'tmds_get_currency_exchange_rates', number_format( $rate, $decimals ), $api );
		}

		return $rate;
	}

	/**
	 * @param        $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_yahoo_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response = array(
			'status' => 'error',
			'data'   => false,
		);
		$now      = current_time( 'timestamp', true );
		$url      = 'https://query1.finance.yahoo.com/v8/finance/chart/' . $source_currency . $target_currency . '=X?symbol=' . $source_currency . $target_currency . '%3DX&period1=' . ( $now - 60 * 86400 ) . '&period2=' . $now . '&interval=1d&includePrePost=false&events=div%7Csplit%7Cearn&lang=en-US&region=US&corsDomain=finance.yahoo.com';

		$request = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
				'timeout'    => 10
			)
		);

		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body   = TMDSPRO_DATA::json_decode( $request['body'] );
			$result = isset( $body['chart']['result'][0]['indicators']['quote'][0]['open'] ) ? array_filter( $body['chart']['result'][0]['indicators']['quote'][0]['open'] ) : ( isset( $body['chart']['result'][0]['meta']['previousClose'] ) ? array( $body['chart']['result'][0]['meta']['previousClose'] ) : array() );
			if ( ! empty( $result ) && is_array( $result ) ) {
				$response['status'] = 'success';
				$response['data']   = end( $result );
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param        $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_cuex_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response        = array(
			'status' => 'error',
			'data'   => false,
		);
		$target_currency = TMDSPRO_DATA::strtolower( $target_currency );
		$source_currency = TMDSPRO_DATA::strtolower( $source_currency );
		$date            = gmdate( 'Y-m-d', current_time( 'timestamp' ) );
		$url             = "https://api.cuex.com/v1/exchanges/{$source_currency}?to_currency={$target_currency}&from_date={$date}&l=en";

		$request = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'timeout'    => 10,
				'headers'    => array(
					'authorization' => 'a68eaffd2ac74c322f5f0835e5aa43d3'
				)
			)
		);

		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body = TMDSPRO_DATA::json_decode( wp_remote_retrieve_body( $request ) );
			if ( isset( $body['data'][0]['rate'] ) ) {
				$response['status'] = 'success';
				$response['data']   = $body['data'][0]['rate'];
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param        $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_wise_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response = array(
			'status' => 'error',
			'data'   => false,
		);
		$url      = "https://wise.com/rates/history?source={$source_currency}&target={$target_currency}&length=1&unit=day&resolution=hourly";

		$request = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'timeout'    => 10,
				'headers'    => array(
					'x-authorization-key' => 'dad99d7d8e52c2c8aaf9fda788d8acdc'
				)
			)
		);

		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			$body = TMDSPRO_DATA::json_decode( wp_remote_retrieve_body( $request ) );
			if ( is_array( $body ) && count( $body ) ) {
				$response['status'] = 'success';
				$response['data']   = end( $body )['value'] ?? 0;
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}

	/**
	 * @param        $target_currency
	 * @param string $source_currency
	 *
	 * @return array
	 */
	private static function get_google_exchange_rate( $target_currency, $source_currency = 'USD' ) {
		$response = array(
			'status' => 'error',
			'data'   => false,
		);
		$url
		          = 'https://www.google.com/async/currency_v2_update?vet=12ahUKEwjfsduxqYXfAhWYOnAKHdr6BnIQ_sIDMAB6BAgFEAE..i&ei=kgAGXN-gDJj1wAPa9ZuQBw&yv=3&async=source_amount:1,source_currency:'
		            . self::get_country_freebase( $source_currency ) . ',target_currency:' . self::get_country_freebase( $target_currency )
		            . ',lang:en,country:us,disclaimer_url:https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fgooglefinance%2Fdisclaimer%2F,period:5d,interval:1800,_id:knowledge-currency__currency-v2-updatable,_pms:s,_fmt:pc';
		$request  = wp_remote_get(
			$url, array(
				'user-agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
				'timeout'    => 10
			)
		);
		if ( ! is_wp_error( $request ) || wp_remote_retrieve_response_code( $request ) === 200 ) {
			preg_match( '/data-exchange-rate=\"(.+?)\"/', $request['body'], $match );
			if ( sizeof( $match ) > 1 && $match[1] ) {
				$response['status'] = 'success';
				$response['data']   = $match[1];
			} else {
				$response['data'] = esc_html__( 'Preg_match fails', 'tmds-woocommerce-temu-dropshipping' );
			}
		} else {
			$response['data'] = $request->get_error_message();
		}

		return $response;
	}
	public static function get_country_freebase( $country_code ) {
		$countries = array(
			"AED" => "/m/02zl8q",
			"AFN" => "/m/019vxc",
			"ALL" => "/m/01n64b",
			"AMD" => "/m/033xr3",
			"ANG" => "/m/08njbf",
			"AOA" => "/m/03c7mb",
			"ARS" => "/m/024nzm",
			"AUD" => "/m/0kz1h",
			"AWG" => "/m/08s1k3",
			"AZN" => "/m/04bq4y",
			"BAM" => "/m/02lnq3",
			"BBD" => "/m/05hy7p",
			"BDT" => "/m/02gsv3",
			"BGN" => "/m/01nmfw",
			"BHD" => "/m/04wd20",
			"BIF" => "/m/05jc3y",
			"BMD" => "/m/04xb8t",
			"BND" => "/m/021x2r",
			"BOB" => "/m/04tkg7",
			"BRL" => "/m/03385m",
			"BSD" => "/m/01l6dm",
			"BTC" => "/m/05p0rrx",
			"BWP" => "/m/02nksv",
			"BYN" => "/m/05c9_x",
			"BZD" => "/m/02bwg4",
			"CAD" => "/m/0ptk_",
			"CDF" => "/m/04h1d6",
			"CHF" => "/m/01_h4b",
			"CLP" => "/m/0172zs",
			"CNY" => "/m/0hn4_",
			"COP" => "/m/034sw6",
			"CRC" => "/m/04wccn",
			"CUC" => "/m/049p2z",
			"CUP" => "/m/049p2z",
			"CVE" => "/m/06plyy",
			"CZK" => "/m/04rpc3",
			"DJF" => "/m/05yxn7",
			"DKK" => "/m/01j9nc",
			"DOP" => "/m/04lt7_",
			"DZD" => "/m/04wcz0",
			"EGP" => "/m/04phzg",
			"ETB" => "/m/02_mbk",
			"EUR" => "/m/02l6h",
			"FJD" => "/m/04xbp1",
			"GBP" => "/m/01nv4h",
			"GEL" => "/m/03nh77",
			"GHS" => "/m/01s733",
			"GMD" => "/m/04wctd",
			"GNF" => "/m/05yxld",
			"GTQ" => "/m/01crby",
			"GYD" => "/m/059mfk",
			"HKD" => "/m/02nb4kq",
			"HNL" => "/m/04krzv",
			"HRK" => "/m/02z8jt",
			"HTG" => "/m/04xrp0",
			"HUF" => "/m/01hfll",
			"IDR" => "/m/0203sy",
			"ILS" => "/m/01jcw8",
			"INR" => "/m/02gsvk",
			"IQD" => "/m/01kpb3",
			"IRR" => "/m/034n11",
			"ISK" => "/m/012nk9",
			"JMD" => "/m/04xc2m",
			"JOD" => "/m/028qvh",
			"JPY" => "/m/088n7",
			"KES" => "/m/05yxpb",
			"KGS" => "/m/04k5c6",
			"KHR" => "/m/03_m0v",
			"KMF" => "/m/05yxq3",
			"KRW" => "/m/01rn1k",
			"KWD" => "/m/01j2v3",
			"KYD" => "/m/04xbgl",
			"KZT" => "/m/01km4c",
			"LAK" => "/m/04k4j1",
			"LBP" => "/m/025tsrc",
			"LKR" => "/m/02gsxw",
			"LRD" => "/m/05g359",
			"LSL" => "/m/04xm1m",
			"LYD" => "/m/024xpm",
			"MAD" => "/m/06qsj1",
			"MDL" => "/m/02z6sq",
			"MGA" => "/m/04hx_7",
			"MKD" => "/m/022dkb",
			"MMK" => "/m/04r7gc",
			"MOP" => "/m/02fbly",
			"MRO" => "/m/023c2n",
			"MUR" => "/m/02scxb",
			"MVR" => "/m/02gsxf",
			"MWK" => "/m/0fr4w",
			"MXN" => "/m/012ts8",
			"MYR" => "/m/01_c9q",
			"MZN" => "/m/05yxqw",
			"NAD" => "/m/01y8jz",
			"NGN" => "/m/018cg3",
			"NIO" => "/m/02fvtk",
			"NOK" => "/m/0h5dw",
			"NPR" => "/m/02f4f4",
			"NZD" => "/m/015f1d",
			"OMR" => "/m/04_66x",
			"PAB" => "/m/0200cp",
			"PEN" => "/m/0b423v",
			"PGK" => "/m/04xblj",
			"PHP" => "/m/01h5bw",
			"PKR" => "/m/02svsf",
			"PLN" => "/m/0glfp",
			"PYG" => "/m/04w7dd",
			"QAR" => "/m/05lf7w",
			"RON" => "/m/02zsyq",
			"RSD" => "/m/02kz6b",
			"RUB" => "/m/01hy_q",
			"RWF" => "/m/05yxkm",
			"SAR" => "/m/02d1cm",
			"SBD" => "/m/05jpx1",
			"SCR" => "/m/01lvjz",
			"SDG" => "/m/08d4zw",
			"SEK" => "/m/0485n",
			"SGD" => "/m/02f32g",
			"SLL" => "/m/02vqvn",
			"SOS" => "/m/05yxgz",
			"SRD" => "/m/02dl9v",
			"SSP" => "/m/08d4zw",
			"STD" => "/m/06xywz",
			"SZL" => "/m/02pmxj",
			"THB" => "/m/0mcb5",
			"TJS" => "/m/0370bp",
			"TMT" => "/m/0425kx",
			"TND" => "/m/04z4ml",
			"TOP" => "/m/040qbv",
			"TRY" => "/m/04dq0w",
			"TTD" => "/m/04xcgz",
			"TWD" => "/m/01t0lt",
			"TZS" => "/m/04s1qh",
			"UAH" => "/m/035qkb",
			"UGX" => "/m/04b6vh",
			"USD" => "/m/09nqf",
			"UYU" => "/m/04wblx",
			"UZS" => "/m/04l7bl",
			"VEF" => "/m/021y_m",
			"VND" => "/m/03ksl6",
			"XAF" => "/m/025sw2b",
			"XCD" => "/m/02r4k",
			"XOF" => "/m/025sw2q",
			"XPF" => "/m/01qyjx",
			"YER" => "/m/05yxwz",
			"ZAR" => "/m/01rmbs",
			"ZMW" => "/m/0fr4f",
		);
		$data      = '';
		if ( $country_code && isset( $countries[ $country_code ] ) ) {
			$data = $countries[ $country_code ];
		}

		return $data;
	}
}