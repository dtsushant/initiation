import React, { memo, useState } from 'react';
import { Page } from '/@/components/common/Page';
import { PageHeader } from '/@/components/common/ui/PageHeader';
import { Breadcrumbs } from '/@/components/common/ui/Breadcrumbs';
import { Button, Card, Divider, Input, type GetProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import searchImage from '/@/assets/searchImage.svg';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const mockSearchResults = [
  {
    id: 1,
    status: 'Active Deal',
    title: 'Celebrate Dashain with a fantastic 30% discount on all products!',
    location: 'Himalayan Java, Tindhara',
    validFrom: 'January 15, 2026',
    validTo: 'February 15, 2026',
    claimedDate: 'April 10, 2026, 3:30PM',
    redeemable: true,
  },
  {
    id: 2,
    status: 'Expired Deal',
    title:
      'Enjoy a special Dashain offer: 20% off sitewide for all your favorite items!',
    location: 'Himalayan Java, Tindhara',
    validFrom: 'January 15, 2026',
    validTo: 'February 15, 2026',
    claimedDate: 'April 10, 2026, 3:30PM',
    redeemable: false,
  },
  {
    id: 3,
    status: 'Expires in 2 days',
    title: "This Dashain, get 15% off on selected items! Don't miss out!",
    location: 'Himalayan Java, Tindhara',
    validFrom: 'January 15, 2026',
    validTo: 'February 15, 2026',
    claimedDate: 'April 10, 2026, 3:30PM',
    redeemable: true,
  },
  {
    id: 4,
    status: 'Expires in 2 days',
    title: 'Limited time Dashain offer: 25% off on all electronics!',
    location: 'Himalayan Java, Tindhara',
    validFrom: 'January 15, 2026',
    validTo: 'February 15, 2026',
    claimedDate: 'April 10, 2026, 3:30PM',
    redeemable: true,
  },
];

export const RedeemDealsPage = memo(() => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchedValue, setSearchedValue] = useState<string>('');

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchedValue(value);

    if (value) {
      setSearchResults(mockSearchResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Page headerLess title="Dashboard">
      <PageHeader title="Redeem Deals" />
      <Breadcrumbs
        items={[
          { title: 'Home', path: '/dashboard' },
          { title: 'Redeem Deals' },
        ]}
      />

      <Card>
        <span className="text-base text-neutral-10">Search Claimed Deals</span>

        <Search
          placeholder="Input Phone Number"
          className="mt-3"
          inputMode="numeric"
          allowClear
          enterButton={
            <>
              <SearchOutlined /> Search
            </>
          }
          size="large"
          onSearch={onSearch}
        />
        <p className="text-xs text-neutral-7 mt-2">
          Please input phone number to find the claimed vouchers and redeem
          them.
        </p>
      </Card>

      <Card className="mt-6 pb-4">
        {searchResults.length > 0 ? (
          <div>
            <h2 className="text-base text-neutral-8 mb-3">
              Claimed Vouchers/Deals of : {searchedValue}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="border border-neutral-4 rounded-lg p-4 flex flex-col justify-between"
                >
                  <div
                    className="flex flex-col justify-between"
                    style={{ minHeight: '150px' }}
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p
                            className={`text-xs ${
                              result.status === 'Active Deal'
                                ? 'text-emeraldgreen-8'
                                : result.status === 'Expired Deal'
                                  ? 'text-ferrarired-6'
                                  : 'text-blazeorange-6'
                            }`}
                          >
                            {result.status}
                          </p>
                          <h3 className="text-base text-neutral-10">
                            {result.title}
                          </h3>
                          <p className="text-xs text-neutral-8 mt-2">
                            {result.location}
                          </p>
                          <p className="text-xs text-neutral-8 mt-2">
                            Valid from: {result.validFrom} to {result.validTo}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-neutral-7">
                      Claimed: {result.claimedDate}
                    </p>

                    <Button
                      type="primary"
                      className={
                        result.redeemable
                          ? 'bg-primary hover:bg-brightorange-6 hover:border-brightorange-6 h-9'
                          : 'bg-neutral-4 text-neutral-6 border-neutral-4 h-9 cursor-not-allowed'
                      }
                      disabled={!result.redeemable}
                    >
                      {result.redeemable ? 'Redeem' : 'Redeemed'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <img className="m-auto" src={searchImage} alt="search" />
            <span className="flex justify-center text-xs text-neutral-7">
              search something to see results here.
            </span>
          </>
        )}
      </Card>
    </Page>
  );
});

RedeemDealsPage.displayName = 'RedeemDealsPage';
