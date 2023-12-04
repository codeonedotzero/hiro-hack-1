;; title: keys
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;
(define-constant contract-owner tx-sender)

;; data vars
;;
(define-data-var gooseFeePercentof100 uint u3)
(define-data-var protocolFeePercentof100 uint u2)
(define-data-var protocolFeeDestination principal 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC)

;; data maps
;;
(define-map geese principal { name: (string-ascii 144), inscription-id: (string-ascii 66) })
(define-map goldenEggHoldings { goose: principal, holder: principal } uint)
(define-map goldenEggSupply { goose: principal } uint)

;; public functions
;;
(define-public (create-goose-gang 
    (goose principal) 
    (name (string-ascii 144)) 
    (inscription-id (string-ascii 66)) 
    (initial-egg-supply uint))
    (begin 
        (map-set geese goose { 
            name: name,
            inscription-id: inscription-id
        })
        (unwrap-panic (lay-eggs goose initial-egg-supply))
        (ok true)
    )
)

(define-public (lay-eggs (goose principal) (egg-count uint))
  (let
    (
      (supply (default-to u0 (map-get? goldenEggSupply { goose: goose })))
      (price (get-price supply egg-count))
    )
    (if (or (> supply u0) (is-eq tx-sender goose))
      (begin
        (asserts! (is-some (map-get? geese goose)) (err u4))
        (match (stx-transfer? price tx-sender (as-contract tx-sender))
          success
          (begin
            (map-set goldenEggHoldings { goose: goose, holder: tx-sender }
              (+ (default-to u0 (map-get? goldenEggHoldings { goose: goose, holder: tx-sender })) egg-count)
            )
            (map-set goldenEggSupply { goose: goose } (+ supply egg-count))
            (if (not (is-eq tx-sender goose)) (unwrap-panic (stx-transfer? 
                (* (/ price u100) (var-get gooseFeePercentof100)) tx-sender goose)) false)
             (unwrap-panic (stx-transfer? 
                 (* (/ price u100) (var-get protocolFeePercentof100)) tx-sender (var-get protocolFeeDestination)))
            (ok true)
          )
          error
          (err u2)
        )
      )
      (err u1)
    )
  )
)

(define-public (break-eggs (goose principal) (egg-count uint))
  (let
    (
      (balance (default-to u0 (map-get? goldenEggHoldings { goose: goose, holder: tx-sender })))
      (supply (default-to u0 (map-get? goldenEggSupply { goose: goose })))
      (price (get-price supply egg-count))
      (recipient tx-sender)
    )
    (if (and (>= balance egg-count) (or (> supply u0) (is-eq tx-sender goose)))
      (begin
        (match (as-contract (stx-transfer? price tx-sender recipient))
          success
          (begin
            (map-set goldenEggHoldings { goose: goose, holder: tx-sender } (- balance egg-count))
            (map-set goldenEggSupply { goose: goose } (- supply egg-count))
            (ok true)
          )
          error
          (err u2)
        )
      )
      (err u1)
    )
  )
)

(define-public (update-fees 
    (goose-fee uint) 
    (protocol-fee uint) 
    (protocol-address principal))
    
    (begin 
        (var-set gooseFeePercentof100 goose-fee)
        (var-set protocolFeePercentof100 protocol-fee)
        (var-set protocolFeeDestination protocol-address)
        (ok true)
    )
)

;; read only functions
;;
(define-read-only (is-eggholder (goose principal) (holder principal))
  (>= (default-to u0 (map-get? goldenEggHoldings { goose: goose, holder: holder })) u1)
)

(define-read-only (get-egg-balance (goose principal) (holder principal))
  ;; Return the keysBalance for the given subject and holder
  (ok (default-to u0 (map-get? goldenEggHoldings { goose: goose, holder: holder })))
)

(define-read-only (get-egg-supply (goose principal))
  ;; Return the keysSupply for the given subject
  (ok (default-to u0 (map-get? goldenEggSupply { goose: goose })))
)

(define-read-only (get-goose (goose principal))
    ;; Implement buy price logic
    (let
        (
            (supply (default-to u0 (map-get? goldenEggSupply { goose: goose })))
            (price (get-price supply u1))
            (goose-fee (* (/ price u100) (var-get gooseFeePercentof100)))
            (protocol-fee (* (/ price u100) (var-get protocolFeePercentof100)))
        )
        (ok {
          address: goose,
          inscription-number: u1,
          supply: supply,
          price: price,
          goose-fee: goose-fee,
          protocol-fee: protocol-fee,
          holder-count: u1
        })
    )
)

(define-read-only (get-fresh-egg-price (goose principal) (egg-count uint))
    ;; Implement buy price logic
    (let
        (
            (supply (default-to u0 (map-get? goldenEggSupply { goose: goose })))
            (price (get-price supply egg-count))
            (goose-fee (* (/ price u100) (var-get gooseFeePercentof100)))
            (protocol-fee (* (/ price u100) (var-get protocolFeePercentof100)))
        )
        (ok {
          address: goose,
          egg-count: egg-count,
          price: price,
          goose-fee: goose-fee,
          protocol-fee: protocol-fee
        })
    )
)

(define-read-only (get-egg-breaking-price (goose principal) (egg-count uint))
    ;; Implement sell price logic
    (let
        (
            (supply (default-to u0 (map-get? goldenEggSupply { goose: goose })))
            (price (get-price supply egg-count))
        )
        (ok price)
    )
)

;; private functions
;;
(define-private (get-price (supply uint) (egg-count uint))
  (let
    (
      (base-price u10)
      (price-change-factor u100)
      (adjusted-supply (+ supply egg-count))
    )
    (+ base-price 
        (* egg-count 
            (/ (* adjusted-supply adjusted-supply) price-change-factor)
        )
    )
  )
)