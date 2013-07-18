R
===

!

## What is R?

The R project _for Statistical Computing_

data로부터 간단하게 insight를 뽑아내기에 적절.

!

## Learn by Example

오늘의 Task

RecoPick 사용자들은 대략 어떤 Browser를 많이 쓰는가?

!

## Install

* Install via ubuntu package<br/>
sudo apt-get install r-base

!

## Running Script

write below content into test.R

    library('RMySQL')
    conn = dbConnect(MySQL(), host='mysql01.recopick.com', user='ubuntu', password='reco7788!#%', dbname = 'recopick')
    rs <- dbSendQuery(conn, "SELECT * FROM LOG_TMP_2 ORDER BY pkid DESC LIMIT 10000")
    d = fetch(rs)

Run R environment and then use source command to load it

    > source('test.R')
    > d = fetch(rs, n = 1)
    > print(d[1]) # which will print pkid

!

## Let's play with results.

    > print(d['Agent']) # lists Agent info from last 10000 logs.
    > print('oops... R does not have ua-parser')

Ok... let's make another script to parse UA

!

## 잠깐 Perl 공부

    $ cpan install HTTP::UA::Parser

Write below script into ua.pl

    use HTTP::UA::Parser;
    $r = HTTP::UA::Parser->new(<STDIN>);
    print $r->ua->family;

Test script

    $ echo "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)" | perl ua.pl
    IE
    $

OK. now back to R

!

## Integrate other script into R

    > system('echo "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)" | perl ua.pl')
    IE>

What? OK. there is 'IE', good.

    > r = system('echo "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)" | perl ua.pl')
    IE> r
    [1] 0
    >

What the...? should use intern = TRUE flag to system command.

    > r = system('echo "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)" | perl ua.pl', intern = TRUE)
    > r
    [1] "IE"

!

## Write a function

Edit test.R... Add below function into test.R script

    parse_ua <- function(str) {
        return(system('echo "' + str + '" | perl ua.pl', intern = TRUE))
    }

in R environment, try reload test.R script.

    > source('test.R')
    > parse_ua('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)')
    오류
    >

!

String concat in R is not '+'. we better use sprintf than using paste(try ?sprintf and ?paste). modify function as below.

    parse_ua <- function(str) {
        return(system(sprintf('echo "%s" | perl ua.pl', str), intern = TRUE))
    }

in R environment, try reload test.R script.

    > source('test.R')
    > parse_ua('Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; InfoPath.2; .NET4.0C; .NET4.0E)')
    [1] "IE"
    > # as expected...

!

## How to convert data d?

d was actually a [dataframe](http://www.r-tutor.com/r-introduction/data-frame), and here is some usages.

    > d[1] # select only first column
    ...
    > d['Agent'] # select only Agent column
    ...
    > d['Agent'][1] # select only Agent column, and then select that column
    ...(same as d['Agent'])
    > dd = d['Agent']
    > dd[1,] # select first row. 1-base index.

!

We need to apply ua parser function to all rows in dd, [how](http://lmgtfy.com/?q=R+apply+map+dataframe)? using apply function

    > r = apply(dd, 1, parse_ua)
    > r
    ... (bunch of results)
    >

!

## Before plotting, we need to group data.

[how? google it](http://lmgtfy.com/?q=R+bar+graph&l=1) ok.. we need to group data in 'r' before plotting.

[how? google it](http://lmgtfy.com/?q=R+data+group+count) [googled result](http://www.slideshare.net/jeffreybreen/grouping-summarizing-data-in-r)

어쨌든 내가 찾은 방법은 table 함수가 있다는 것.

!

    > uas = unique(r)
    > uas
    ...(try yourself)
    > table(r)
    ...(try yourself)
    >

!

## Plot

just do it

    > plot(table(r))

!

## Mix all into single script

Completed test.R(don't forget about ua.pl)

    library('RMySQL')
    
    parse_ua <- function(str) {
        return(system(sprintf('echo "%s" | perl ua.pl', str), intern = TRUE))
    }
    
    conn = dbConnect(MySQL(), host='mysql01.recopick.com', user='ubuntu', password='reco7788!#%', dbname = 'recopick')
    
    rs <- dbSendQuery(conn, "SELECT * FROM LOG_TMP_2 ORDER BY pkid DESC LIMIT 10000")
    d = fetch(rs)
    
    r = apply(d['Agent'], 1, parse_ua)
    plot(table(r))

Try it with

    > source('test.R')

!

## Appendix

[Coding Convention](http://google-styleguide.googlecode.com/svn/trunk/google-r-style.html)

