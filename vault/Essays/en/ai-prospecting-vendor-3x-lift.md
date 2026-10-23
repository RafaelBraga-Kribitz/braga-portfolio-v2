---
code: "02-01"
kind: essay
date: "2026-09-19"
summary: "A vendor-authored benchmark on AI prospecting is enough to justify a pilot, not a purchase. Four buyer conditions close the gap."
lead: "A vendor-authored benchmark on AI prospecting is enough to justify a pilot, not a purchase. Four buyer conditions close the gap."
tags: [ martech, measurement, prospecting ]
lang: en
slug: ai-prospecting-vendor-3x-lift
translationStatus: approved
publish: true
---

# An AI prospecting vendor claims a 3× lift. What I would require before signing.

Vendors of AI prospecting tools promise more leads, less research, better qualification and a faster pipeline. One recent case study puts a number on it: an AI prospecting platform found roughly three times more relevant leads than a conventional web crawler, with about 90% precision and recall in lead qualification, and sales professionals rating its AI-written summaries favourably.

The study is Kaplan, Seker and Yoruk (2025), “A review of AI-based business lead generation: Scrapus as a case study”, published in Frontiers in Artificial Intelligence. One detail matters before anything else: the third author is affiliated with OptiWisdom, the company behind Scrapus. This is a vendor evaluating its own product. That does not make the results wrong. It makes them a sales document with a methods section, and I read it as one.

I spent twenty years buying marketing technology. The question I learned to ask is not “does the model work?” It is “what would have to be true for this result to show up in my numbers?”

Here is what the paper shows, what it does not, and the four conditions I would need met before signing.

## What the evidence actually supports

The paper is careful in places. It tunes the crawler for yield, the extractor for recall and the qualifier for precision, and it says so. It also grounds the language model in extracted facts to limit invention. Those are sensible choices.

Three things weaken the headline.

**The crawler is graded on its own reward.** The crawler earns a reward when the extraction module finds a lead on a page. The success metric, harvest rate, is the share of crawled pages where the extraction module found a lead. The system is optimised on the signal it is later scored by. A 3× improvement on that loop tells me the crawler learned to please the extractor. It does not tell me the leads are good.

**Every baseline is the weakest plausible one.** Breadth-first crawling with a keyword filter. An off-the-shelf entity recogniser with no fine-tuning. A lead scorer that counts keywords. A summary copied from the About page. Beating those is expected. The comparison I would want, against a commercial competitor or a trained sales development representative with a search engine, is not in the paper.

**The precision-recall curve is not a curve.** The text describes precision-recall curves, one model dominating the other, and an area under the curve of 0.92 against 0.79. The figure is a bar chart with two precision bars and two recall bars. You cannot read an area under the curve off four bars. Either the figure was swapped or the curve was never drawn. Either way, a reader who trusts the text over the figure is trusting the wrong one.

None of this is disqualifying. It is the normal gap between a vendor benchmark and a buyer decision. The four conditions below are how I close that gap.

## More discovered leads must become more pipeline

A 15% harvest rate versus 5% is an efficiency metric. It measures how well the system navigates the web. It does not measure meetings booked, sales-accepted leads, opportunities created or revenue.

This is the most common failure in marketing technology evaluation. Vendors optimise intermediate metrics because that is what they control. Buyers need outcomes because that is what they pay for.

Buyer question: do the extra leads become extra revenue, or only extra records in the CRM?

## My ideal customer must be visible in public data

The system finds companies by what they publish: websites, funding news, hiring, product launches, partnerships. The study tested five author-defined profiles, such as healthcare software or European logistics start-ups, on a corpus of more than 200,000 pages. That is real work. It is also a market where companies leave traces constantly.

An Austrian industrial supplier selling to a few hundred plant managers is a different environment. Buying committees are hidden, intent signals are rare, and the relationship matters more than any announcement. A model does not generalise because it is intelligent. It generalises when the data-generating process on my side looks like the one it was tested on.

Buyer question: does my ideal customer leave enough observable signal for this to work at all?

## Precision has a cost structure, and the sales team pays it

Ninety per cent precision sounds excellent until you multiply it. A thousand leads at 10% false positives is a hundred bad recommendations. At five minutes of review each, that is a full working day spent on leads that were never real, every time the list refreshes.

And that assumes the team reviews them at all. A tool with 90% precision that sales ignores has a precision of zero. The paper reports that users preferred the AI summaries. It does not measure adoption, time saved, CRM integration or how representatives behaved after week two. Implementation risk is usually larger than algorithm risk. I have watched more tools die of friction than of bad models.

Buyer question: how many leads reach sales acceptance at a cost the team will tolerate?

## The total cost must fall, not move

The number that matters is not leads divided by licence fee. It is pipeline created divided by total cost: licence, integration, data cleaning, sales labour, change management and the projects that did not happen because this one did.

A 3× lift in discovery can still destroy value if it triples the review load, adds a data-cleaning step and needs a headcount to babysit the CRM sync.

Buyer question: does this reduce acquisition cost, or shift the work into a part of the process I am not measuring?

## My decision rule

I would not buy on a published benchmark, least of all one the vendor wrote.

I would run a two-week paid pilot on my own ideal customer profile, my own geography, my own sales process, my own CRM and my own team. Before it starts, I would want the data-protection answer in writing: the system stores person-level records scraped from the open web, and in the European Union that needs a legal basis and a notification duty, not a promise.

I would measure sales-accepted leads, meetings booked, opportunities created, cost per sales-accepted lead, and whether the team is still opening the tool on day ten.

I would not measure harvest rate, records extracted, crawl coverage or F1 scores. Those are the vendor’s metrics. The pilot exists to find out whether they turn into mine.

The paper is enough to justify a pilot. It is not enough to justify a purchase. That is the right place for a peer-reviewed vendor benchmark to sit: interesting, plausible, and two weeks of my data away from being believed.
