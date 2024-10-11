Idol Mart POS

Setup database
1. Postgresql setup
2. create database
3. restore database

Setup system
1. sync Category
2. sync Product
3. sync Harga
4. sync Promo
5. sync No Sale
6. Sync Shortcut
7. reset locator

Command line instructions
You can also upload existing files from your computer using the instructions below.

Git global setup
git config --global user.name "Agus ASP"
git config --global user.email "agus@sunrise-persada.com"

-------
git add *
git commit -am "Last Update xxxxx"
git push origin master

----
Update target repository
git pull
----

Build to linux
npm run build

Complile to linux
npm run deb64



revisi 19-11-2019
 Penambahan Tebus Murah
Database
 --proc_pos_dtempsalesline_insert
 --proc_pos_dtempsalesline_update
 --trig_pos_dsales_promomurah_update
 --alter table pos_dsales add column ispromomurah bool;
 --alter table pos_dtempsalesline add column ispromomurah bool;



 revisi 01-02-2021
 version 1.0.8
 - Penambahan Promo Promo ID dan member id
 - Capture Promo Name, member id
 - perbaikan stok minus
 
 Database Client Side:
1. pos_dtempsalesline
* add column discountname

2. pos_dsalesline
* add column discountname

3. proc_pos_dsales_cash_insert
4. proc_pos_dsales_credit_insert
5. proc_pos_dsales_debit_insert
6. proc_pos_mproduct_bybarcode_get
7. proc_pos_dtempsalesline_insert
8.proc_pos_dsalesline_sync_view

Database Server Side
1. pos_dbillline
    * add new column discountname
2. proc_pos_dbillline_2_sync

new logic:
Jika member ID di isi dan promo ID tidak = maka cek di promo member apakah product ada
jika promo id di isi dan member id tidak = maka cek di promo member apakah promo id dan product ada
jika semua diisi = maka cek di promo member apakah promo id dan product ada.











 





