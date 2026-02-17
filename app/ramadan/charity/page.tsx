'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ramadanService,
  type CharityInfo,
  type BankAccount,
} from '@/lib/services/ramadan-service';
import { Copy, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RamadanCharityPage() {
  const [charityInfo, setCharityInfo] = useState<CharityInfo[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const [info, accounts] = await Promise.all([
        ramadanService.getCharityInfo(),
        ramadanService.getBankAccounts(),
      ]);
      setCharityInfo(info);
      setBankAccounts(accounts);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCopyAccount = (accountNumber: string, accountName: string) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopiedAccount(accountNumber);
      toast({
        title: 'Copied',
        description: `${accountName} account number copied`,
      });
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading charity information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600/20 rounded-full mb-6">
            <Heart className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Ramadan Charity</h1>
          <p className="text-slate-400">
            Support our mission during the blessed month of Ramadan
          </p>
        </div>

        {/* Charity Information */}
        <div className="grid gap-6 mb-12">
          {charityInfo.map((info) => (
            <Card key={info.id} className="bg-slate-900/50 border-slate-700 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  {info.icon && <span className="text-2xl">{info.icon}</span>}
                  {info.section_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 leading-relaxed">{info.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent my-12" />

        {/* Bank Account Details */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Charity Account Details</h2>

          {bankAccounts.length > 0 ? (
            <div className="space-y-4">
              {bankAccounts.map((account) => (
                <Card
                  key={account.id}
                  className="bg-slate-900/50 border-slate-700 backdrop-blur hover:border-emerald-600/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-400">
                      {account.account_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Account Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950/30 p-4 rounded">
                        <p className="text-slate-400 text-sm mb-1">Bank Name</p>
                        <p className="text-white font-medium">{account.bank_name}</p>
                      </div>
                      <div className="bg-slate-950/30 p-4 rounded">
                        <p className="text-slate-400 text-sm mb-1">Currency</p>
                        <p className="text-white font-medium">{account.currency}</p>
                      </div>
                    </div>

                    {/* Account Number */}
                    <div className="bg-gradient-to-r from-emerald-600/10 to-emerald-600/5 border border-emerald-600/20 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-2">Account Number</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-mono text-lg tracking-wider">
                          {account.account_number}
                        </p>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleCopyAccount(account.account_number, account.account_name)
                          }
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedAccount === account.account_number ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    {/* Account Type */}
                    {account.account_type && (
                      <div className="bg-slate-950/30 p-4 rounded">
                        <p className="text-slate-400 text-sm mb-1">Account Type</p>
                        <p className="text-white font-medium">{account.account_type}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Important Note */}
              <Card className="bg-blue-600/10 border-blue-600/20">
                <CardContent className="pt-6">
                  <p className="text-blue-200 text-sm leading-relaxed">
                    <span className="font-semibold">Important:</span> All donations are managed
                    by Hamduk Islamic Foundation with transparency and integrity. Your
                    contribution helps us provide Islamic education, community support, and
                    welfare programs.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="py-8 text-center text-slate-400">
                <p>Bank account details will be available soon.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-emerald-600/20 to-emerald-600/10 border border-emerald-600/30 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Support Our Ramadan Activities
          </h3>
          <p className="text-slate-300 mb-6">
            Your generosity during Ramadan multiplies the reward and helps us serve the
            community. Every contribution makes a difference.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2">
            Make a Donation
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>
            By Hamduk Islamic Foundation - Serving the community with integrity and compassion
          </p>
        </div>
      </div>
    </div>
  );
}
