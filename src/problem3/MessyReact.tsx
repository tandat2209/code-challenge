// ISSUE: Missing 'blockchain' property - used in getPriority function but not defined
interface WalletBalance {
  currency: string;
  amount: number;
  // blockchain: string; // Missing property
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// ISSUE: Empty interface extension - acceptable if plan to extend the component
interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	// ISSUE: Using 'any' type instead of proper typing, should be string
	const getPriority = (blockchain: any): number => {
    // ISSUE: Consider using a Map for better performance
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  // BUG: 'lhsPriority' is undefined - should be 'balancePriority'
		  if (lhsPriority > -99) {
		     // LOGIC ERROR: This filters OUT positive balances
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
		  // MISSING: No return for equal priorities case
    });
  }, [balances, prices]); // INEFFICIENCY: 'prices' not used in this computation

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  // ISSUE: should use formattedBalances instead of sortedBalances, formatted only exists on FormattedWalletBalance
  // consider useMemo for rows mapping
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index} // ANTI-PATTERN: Using index as key instead of unique identifier
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted} // ERROR: 'formatted' doesn't exist on WalletBalance
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
