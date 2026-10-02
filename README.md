# n8n-nodes-partnero

An [n8n](https://n8n.io) community node for [Partnero](https://www.partnero.com), the
affiliate and referral program platform.

Use it to create referred customers, record sales so commission is calculated, manage
partners and leads, and start workflows the moment something happens in your program.

The package ships two nodes: **Partnero** for actions, and **Partnero Trigger** for
reacting to webhook events.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) ·
[Trigger](#trigger) · [Example workflows](#example-workflows) · [Resources](#resources)

## Installation

Follow n8n's [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation-and-management/).

In a self-hosted n8n, go to **Settings → Community Nodes**, select **Install**, and enter:

```text
n8n-nodes-partnero
```

## Credentials

The node authenticates with a Partnero API key.

1. Open your Partnero dashboard.
2. Go to **Integration → API**.
3. Copy the API key for the program you want to automate.
4. In n8n, create new **Partnero API** credentials and paste the key.

Use **Test** to confirm the key works before building a workflow.

An API key belongs to a **single program**. If you run more than one Partnero program, add
one credential per program and pick the right one on each node.

## Operations

### Customer

| Operation | Description |
| --- | --- |
| Create | Record a referred sign-up, which creates the referral relationship |
| Get | Fetch one customer by key, ID or email |
| Get Many | List customers, optionally filtered by referring partner |
| Get Transactions | List every transaction recorded against one customer |
| Search | Find customers by email, key or ID |
| Update | Change a customer's email, name or surname |
| Archive / Unarchive | Archive a customer so they stop earning, or restore them |
| Delete | Permanently delete a customer |

### Partner

| Operation | Description |
| --- | --- |
| Create | Add a partner to the program |
| Get | Fetch one partner by referral key, ID or email |
| Get Many | List partners in the program |
| Get Referral Links | List every referral link belonging to one partner |
| Get Sign In URL | Create a one-time portal sign-in URL, for embedding in your own app |
| Search | Find partners by referral key or ID |
| Add Reward | Credit a one-off bonus, outside the commission rules |
| Update | Change a partner's details |
| Archive / Unarchive | Archive a partner so they stop earning, or restore them |
| Delete | Permanently delete a partner |

A partner has two different identifiers, and mixing them up is the easiest mistake to
make. The **ID** is the opaque value Partnero returns in the `id` field. The **referral
key** is the readable one that appears in their link, as in `?aff=theirkey`.

Add Reward, Archive, Unarchive, Update, Delete and Get Referral Links all need the **ID**;
a referral key returns "not found" there. Get, Search and Get Sign In URL accept either,
so if the referral key is all you have, run Get first and pass `{{ $json.id }}` on from
there.

### Transaction

| Operation | Description |
| --- | --- |
| Create | Record a sale so commission is calculated |
| Get | Fetch one transaction, including the rewards it generated |
| Get Many | List transactions, optionally filtered by key or partner |
| Archive / Unarchive | Archive a transaction without deleting it, or restore it |
| Delete | Reverse a transaction and its commission, as you would on a refund |

### Lead

| Operation | Description |
| --- | --- |
| Create | Submit a lead on behalf of a partner |
| Convert | Mark a lead as converted and record the commissionable amount |
| Reject | Mark a lead as rejected |
| Get | Fetch one lead |
| Get Many | List leads in the program |
| Delete | Permanently delete a lead |

## Trigger

**Partnero Trigger** registers a webhook in your program when the workflow is activated
and removes it when the workflow is deactivated — there is nothing to configure in the
Partnero dashboard.

Pick the events you care about. Which ones exist depends on your program type: affiliate
programs have partner, customer, transaction and lead events; refer-a-friend programs have
customer and transaction events; newsletter programs have subscriber events. Partnero
rejects events its program does not support, which surfaces as an error when you activate
the workflow.

Each delivery arrives as:

```json
{
  "event": "transaction.created",
  "url": "https://your-n8n/webhook/...",
  "webhook_key": "...",
  "created_at": "2026-09-30T10:00:00.000000Z",
  "data": {}
}
```

Deliveries are signed. The trigger stores the secret Partnero issues at registration and
checks the `Signature` header against the raw request body, discarding anything that does
not match. Leave **Verify Signature** on unless you are debugging.

## Program types change what you send

The **Create** operation behaves differently depending on your program type, so check
which one you have in your dashboard before building a workflow. The two covered here are
affiliate and refer-a-friend; newsletter programs work on subscribers, which this node
does not expose yet, though the trigger does report their events.

In an **affiliate** program, partners are separate people who refer customers. A customer
only exists in the context of a partner, so **Attribute To** must be set to *Partner* and
the partner must resolve. A missing or unknown partner causes the request to fail — it is
not silently ignored.

In a **refer-a-friend** program, customers refer each other. The referrer is optional, so
*Referring Customer* or *Nobody* are both valid.

The attribution value usually comes from the cookie Partnero's tracking script writes on
your site: `partnero_partner` in an affiliate program, `partnero_referral` in a
refer-a-friend program.

## Example workflows

**Record a referred sign-up.** Webhook (your app posts a new user, including the referral
key from the cookie) → Partnero → Customer → Create. Set *Customer Key* to your user ID
and *Partner* to the referral key.

**Record a sale that no payment integration covers.** Your billing event → Partnero →
Transaction → Create, with the order or invoice ID as *Transaction Key* and the customer
key you used at sign-up.

Before building this, check whether you need it. If the payment runs through Stripe,
Paddle or Chargebee, connect that integration in Partnero instead — it records
transactions for you, and doing both records the sale twice and pays commission twice.
Reach for this node when there is no integration to lean on: in-house billing, invoicing,
bank transfers or offline sales.

When you do record transactions yourself, make sure the workflow cannot run twice for one
payment. Transaction keys are **not unique** in Partnero, so a second call creates a
second transaction and a second commission. Checking first with *Get Many* narrows the
window but does not close it — two deliveries arriving together can both see nothing and
both write. Trigger on something that happens once per payment, or keep a record of the
IDs you have already sent and skip the ones you have seen.

**Reward a partner on every qualifying sale.** Partnero Trigger on `transaction.created` →
If (amount above your threshold) → Partnero → Partner → Add Reward.

No lookup step is needed in between: the event payload already carries the credited
partner in `{{ $json.data.partner }}`, and it is the partner ID, which is exactly what Add
Reward expects.

**Reconcile a partner's customers.** Schedule Trigger → Partnero → Customer → Get Many
with *Return All* on and a *Partner Key* filter → compare against your own records.

**Route new leads to your CRM.** Partnero Trigger on `lead.submitted` → your CRM node,
carrying `{{ $json.data.id }}` across as a field on the deal. When the deal closes, your
CRM's own trigger → Partnero → Lead → Convert with that lead ID and the closed value, so
the partner earns commission on what the deal was actually worth.

**Welcome new partners.** Partnero Trigger on `partner.created` → your email tool, using
the referral link from the event payload so the partner gets everything they need in the
first message.

## Resources

- [Partnero API reference](https://docs.partnero.com/api-reference/introduction)
- [Partnero documentation](https://docs.partnero.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## Compatibility

Requires n8n with community node support. Built and verified against n8n 2.41.

## Support

Questions about the Partnero API: hello@partnero.com. Problems with this node: open an
issue on this repository.

## License

[MIT](LICENSE)
